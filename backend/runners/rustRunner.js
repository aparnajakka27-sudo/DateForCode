const fs = require("fs");
const path = require("path");

const generateRustHarness = (userCode, funcName, testCases) => {
    let harness = `${userCode}\n\n`;

    harness += `fn main() {\n    print!("{{\\"results\\": [");\n`;

    testCases.forEach((tc, idx) => {
        let callStr = tc.input;
        if (!callStr.trim().startsWith(funcName)) {
            callStr = `${funcName}(${tc.input})`;
        }

        // Convert slice notations: [1, 2] -> vec![1, 2]
        let callFormatted = callStr.replace(/\[([\d,\s\-]+)\]/g, "vec![$1]");
        let expectedFormatted = tc.expected.replace(/\[([\d,\s\-]+)\]/g, "vec![$1]");

        harness += `    {\n`;
        harness += `        let actual = ${callFormatted};\n`;
        harness += `        let expected = ${expectedFormatted};\n`;
        harness += `        let passed = actual == expected;\n`;
        harness += `        print!("{{\\"passed\\": {}, \\"actual\\": \\"{:?}\\", \\"expected\\": \\"{:?}\\"}}", passed, actual, expected);\n`;
        if (idx < testCases.length - 1) {
            harness += `        print!(", ");\n`;
        }
        harness += `    }\n`;
    });

    harness += `    println!("]}}");\n}\n`;
    return harness;
};

const runRust = (sessionDir, code, functionName, testCases, dockerVol) => {
    const rustCode = generateRustHarness(code, functionName, testCases);
    fs.writeFileSync(path.join(sessionDir, "main.rs"), rustCode);
    const isWindows = process.platform === "win32";
    const binaryPath = path.join(sessionDir, isWindows ? "solution.exe" : "solution");

    const mainRustPath = path.join(sessionDir, "main.rs").replace(/\\/g, "/");
    const normalBinaryPath = binaryPath.replace(/\\/g, "/");
    const execCmd = isWindows ? binaryPath.replace(/\//g, "\\") : normalBinaryPath;

    const dockerCmd = `docker run --rm -v "${dockerVol}:/app" rust:1.75-slim sh -c "rustc -O -o /app/solution /app/main.rs && /app/solution"`;
    const localCmd = `rustc -O -o "${normalBinaryPath}" "${mainRustPath}" && "${execCmd}"`;

    return { dockerCmd, localCmd };
};

module.exports = { runRust };
