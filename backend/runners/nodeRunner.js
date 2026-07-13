const fs = require("fs");
const path = require("path");

const runNode = (sessionDir, code, functionName, testCases, dockerVol) => {
    fs.writeFileSync(path.join(sessionDir, "solution.js"), code);

    const jsHarness = `
const fs = require('fs');
const path = require('path');
try {
    const configPath = fs.existsSync('/app/config.json') ? '/app/config.json' : path.join(__dirname, 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const funcName = config.functionName;
    const testCases = config.testCases;
    
    const solutionPath = fs.existsSync('/app/solution.js') ? '/app/solution.js' : path.join(__dirname, 'solution.js');
    let userCode = fs.readFileSync(solutionPath, 'utf8');
    userCode += '\\n\\ntry { module.exports = { ' + funcName + ' }; } catch(e) { module.exports = ' + funcName + '; }';
    
    const solutionCompiledPath = fs.existsSync('/app/') ? '/app/solution_compiled.js' : path.join(__dirname, 'solution_compiled.js');
    fs.writeFileSync(solutionCompiledPath, userCode);
    
    const solution = require(solutionCompiledPath);
    const target = solution[funcName] || solution;
    
    if (!target) {
        throw new Error("Function or Class '" + funcName + "' is not defined.");
    }

    const results = [];
    for (const tc of testCases) {
        try {
            let actual;
            if (['LFUCache', 'MedianFinder', 'NumMatrix', 'WordFilter'].includes(funcName)) {
                const args = eval('[' + tc.input + ']');
                const methods = args[0];
                const params = args[1];
                const runResults = [];
                let instance = null;
                for (let i = 0; i < methods.length; i++) {
                    const method = methods[i];
                    const paramList = params[i];
                    if (i === 0) {
                        instance = new target(...paramList);
                        runResults.push(null);
                    } else {
                        const res = instance[method](...paramList);
                        runResults.push(res !== undefined ? res : null);
                    }
                }
                actual = runResults;
            } else {
                global[funcName] = target;
                if (tc.input.includes(funcName)) {
                    actual = eval(tc.input);
                } else {
                    actual = eval('target(' + tc.input + ')');
                }
            }
            const expected = eval(tc.expected);
            const passed = JSON.stringify(actual) === JSON.stringify(expected);
            results.push({
                passed,
                actual: JSON.stringify(actual),
                expected: JSON.stringify(expected)
            });
        } catch (e) {
            results.push({ passed: false, error: e.message });
        }
    }
    console.log(JSON.stringify({ results }));
} catch (e) {
    console.log(JSON.stringify({ error: "Initialization/Syntax Error: " + e.message }));
    process.exit(1);
}
`;
    fs.writeFileSync(path.join(sessionDir, "harness.js"), jsHarness);
    const dockerCmd = `docker run --rm -v "${dockerVol}:/app" node:20-slim node /app/harness.js`;
    const localCmd = `node "${path.join(sessionDir, "harness.js")}"`;

    return { dockerCmd, localCmd };
};

module.exports = { runNode };
