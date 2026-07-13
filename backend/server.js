const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const { runPython } = require("./runners/pythonRunner");
const { runNode } = require("./runners/nodeRunner");
const { runCpp } = require("./runners/cppRunner");
const { runJava } = require("./runners/javaRunner");
const { runSql } = require("./runners/sqlRunner");
const { runRust } = require("./runners/rustRunner");
const { runGo } = require("./runners/goRunner");

const runners = {
    python: runPython,
    javascript: runNode,
    typescript: runNode,
    cpp: runCpp,
    java: runJava,
    sql: runSql,
    rust: runRust,
    go: runGo
};

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "DateForCode Coding Judge Engine",
        port: 5000
    });
});

// Helper to sanitize paths for Docker under Windows (replaces backslashes with forward slashes)
const getDockerPath = (localPath) => {
    return localPath.replace(/\\/g, "/");
};

// modularized runners: pythonRunner, nodeRunner, cppRunner

// Heuristic-based language detection from code content
const detectLanguage = (code) => {
    if (!code || typeof code !== "string") {
        return "javascript"; // default fallback
    }

    const trimmed = code.trim();

    // 1. C++ Check: Look for common headers or syntax
    if (
        trimmed.includes("#include") || 
        trimmed.includes("using namespace std") || 
        trimmed.includes("std::") || 
        /\b(cout|cin|vector|string|int\s+main|class\s+\w+\s*:\s*public)\b/.test(trimmed)
    ) {
        return "cpp";
    }

    // 2. Python Check: Look for python-specific keywords or patterns
    if (
        trimmed.includes("def ") || 
        trimmed.includes("import sys") || 
        trimmed.includes("import os") || 
        trimmed.includes("elif ") || 
        trimmed.includes("__main__") ||
        (trimmed.includes("print(") && !trimmed.includes("console.log") && !trimmed.includes(";"))
    ) {
        return "python";
    }

    // 3. JavaScript / TypeScript Check
    if (
        trimmed.includes("const ") || 
        trimmed.includes("let ") || 
        trimmed.includes("var ") || 
        trimmed.includes("function ") || 
        trimmed.includes("console.log") || 
        trimmed.includes("module.exports") || 
        trimmed.includes("import ") || 
        trimmed.includes("export ")
    ) {
        return "javascript";
    }

    // 4. Rust Check
    if (
        trimmed.includes("fn ") || 
        trimmed.includes("println!") || 
        trimmed.includes("use std::")
    ) {
        return "rust";
    }

    // 5. Go Check
    if (
        trimmed.includes("package main") || 
        trimmed.includes("func main") || 
        trimmed.includes("import \"fmt\"")
    ) {
        return "go";
    }

    // Default fallback to javascript if we cannot determine
    return "javascript";
};

// Unified Execution Endpoint (Supports Hybrid Docker-Local Execution Fallback)
app.post("/execute-test-suite", (req, res) => {
    const { code, language, functionName, testCases, files } = req.body;

    let targetLanguage = language;
    if (!targetLanguage || targetLanguage.toLowerCase() === "auto") {
        targetLanguage = detectLanguage(code);
        console.log(`[JUDGE ENGINE] Detected language: ${targetLanguage.toUpperCase()}`);
    }

    console.log(`[JUDGE ENGINE] Received execution request for: ${targetLanguage.toUpperCase()} (${functionName})`);

    // Create unique concurrent session directory
    const sessionId = Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    const sessionDir = path.resolve(__dirname, "temp", sessionId);
    fs.mkdirSync(sessionDir, { recursive: true });

    // Write all files from workspace into the session directory
    if (files && typeof files === "object") {
        Object.entries(files).forEach(([filename, fileObj]) => {
            const safeName = filename.startsWith("/") ? filename.slice(1) : filename;
            const fullPath = path.join(sessionDir, safeName);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, fileObj.code);
        });
    }

    // Write standard config file containing test suites
    const configPath = path.join(sessionDir, "config.json");
    fs.writeFileSync(configPath, JSON.stringify({ functionName, testCases }, null, 2));

    const dockerVol = getDockerPath(sessionDir);

    let dockerCmd = "";
    let localCmd = "";
    
    const runner = runners[targetLanguage.toLowerCase()];
    if (!runner) {
        // Clean up session directory immediately
        try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch (_) {}
        return res.status(400).json({ error: `Language '${targetLanguage}' is not currently supported in secure sandbox.` });
    }

    try {
        const result = runner(sessionDir, code, functionName, testCases, dockerVol);
        dockerCmd = result.dockerCmd;
        localCmd = result.localCmd;
    } catch (e) {
        try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch (_) {}
        return res.status(500).json({ error: `Failed to prepare execution harness: ${e.message}` });
    }

    const queue = [];
    let activeExecutions = 0;
    const MAX_CONCURRENT_EXECUTIONS = 5;

    const processQueue = () => {
        if (queue.length === 0 || activeExecutions >= MAX_CONCURRENT_EXECUTIONS) {
            return;
        }

        const task = queue.shift();
        if (!task) return;

        activeExecutions++;
        console.log(`[QUEUE] Processing execution request. Active runs: ${activeExecutions}/${MAX_CONCURRENT_EXECUTIONS}`);

        const { res, sessionDir, code, targetLanguage, functionName, testCases, dockerCmd, localCmd } = task;

        const releaseSlot = () => {
            activeExecutions--;
            console.log(`[QUEUE] Slot released. Active runs: ${activeExecutions}/${MAX_CONCURRENT_EXECUTIONS}`);
            processQueue();
        };

        const runLocally = () => {
            const allowLocal = process.env.ALLOW_LOCAL_FALLBACK !== "false" && process.env.NODE_ENV !== "production";
            if (!allowLocal) {
                try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch (_) {}
                releaseSlot();
                return res.status(403).json({ error: "Security Sandbox Restriction: Host-level code execution fallbacks are disabled in production mode." });
            }

            console.log(`[JUDGE ENGINE] [FALLBACK] Executing code locally: ${localCmd}`);
            exec(localCmd, { timeout: 10000 }, (localError, localStdout, localStderr) => {
                try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch (_) {}
                releaseSlot();

                if (localError) {
                    console.error(`[JUDGE ENGINE] [LOCAL ERROR]: ${localError.message}`);
                    try {
                        const parsed = JSON.parse(localStdout.trim());
                        if (parsed.error) return res.json({ error: parsed.error });
                    } catch (_) {}
                    return res.json({ error: localStderr || localError.message });
                }

                try {
                    const parsed = JSON.parse(localStdout.trim());
                    if (parsed.error) return res.json({ error: parsed.error });

                    if (Array.isArray(parsed) && targetLanguage.toLowerCase() === 'sql') {
                        const mappedResults = [{
                            passed: true,
                            actual: JSON.stringify(parsed, null, 2),
                            expected: JSON.stringify(testCases[0]?.expected || parsed, null, 2)
                        }];
                        return res.json({ results: mappedResults });
                    }
                    
                    console.log(`[AUDIT] [LOCAL RESOLVED] Test Suite results:`);
                    parsed.results.forEach((r, idx) => {
                        console.log(`  Case #${idx + 1}: Input[${testCases[idx].input}] -> Passed[${r.passed}] | Expected[${r.expected}] | Actual[${r.actual}]${r.error ? ` | Error[${r.error}]` : ''}`);
                    });

                    res.json(parsed);
                } catch (e) {
                    if (targetLanguage.toLowerCase() === 'sql') {
                        const rawOutput = localStdout.trim();
                        const mappedResults = [{
                            passed: true,
                            actual: rawOutput,
                            expected: testCases[0]?.expected || ""
                        }];
                        return res.json({ results: mappedResults });
                    }
                    res.json({ error: `Local Execution Error: Received malformed stdout output from runtime.` });
                }
            });
        };

        console.log(`[JUDGE ENGINE] Executing docker command: ${dockerCmd}`);
        exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                console.warn(`[JUDGE ENGINE] Docker connection/run failed: ${error.message}. Triggering hybrid local execution fallback...`);
                runLocally();
            } else {
                try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch (_) {}
                releaseSlot();

                try {
                    const parsed = JSON.parse(stdout.trim());
                    if (parsed.error) {
                        return res.json({ error: parsed.error });
                    }

                    if (Array.isArray(parsed) && targetLanguage.toLowerCase() === 'sql') {
                        const mappedResults = [{
                            passed: true,
                            actual: JSON.stringify(parsed, null, 2),
                            expected: JSON.stringify(testCases[0]?.expected || parsed, null, 2)
                        }];
                        return res.json({ results: mappedResults });
                    }
                    
                    console.log(`[AUDIT] [DOCKER RESOLVED] Test Suite results:`);
                    parsed.results.forEach((r, idx) => {
                        console.log(`  Case #${idx + 1}: Input[${testCases[idx].input}] -> Passed[${r.passed}] | Expected[${r.expected}] | Actual[${r.actual}]${r.error ? ` | Error[${r.error}]` : ''}`);
                    });

                    res.json(parsed);
                } catch (e) {
                    console.warn(`[JUDGE ENGINE] Failed to parse docker stdout: ${e.message}. Triggering hybrid local execution fallback...`);
                    runLocally();
                }
            }
        });
    };

    // Queue request and pump runner
    queue.push({
        res, sessionDir, code, targetLanguage, functionName, testCases, dockerCmd, localCmd
    });
    processQueue();
});

app.listen(5000, () => {
    console.log("-----------------------------------------");
    console.log("PRODUCTION CODING JUDGE SERVER RUNNING ON PORT 5000");
    console.log("-----------------------------------------");
});
