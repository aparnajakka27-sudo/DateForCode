const fs = require("fs");
const path = require("path");

const generateGoHarness = (userCode, funcName, testCases) => {
    let harness = `package main\n\nimport (\n\t"fmt"\n\t"reflect"\n)\n\n${userCode}\n\n`;

    harness += `func main() {\n\tfmt.Print("{\\"results\\": [")\n`;

    testCases.forEach((tc, idx) => {
        let callStr = tc.input;
        if (!callStr.trim().startsWith(funcName)) {
            callStr = `${funcName}(${tc.input})`;
        }

        // Convert slice notations: [1, 2] -> []int{1, 2}
        let callFormatted = callStr.replace(/\[([\d,\s\-]+)\]/g, "[]int{$1}");
        let expectedFormatted = tc.expected.replace(/\[([\d,\s\-]+)\]/g, "[]int{$1}");
        
        if (expectedFormatted === 'true') expectedFormatted = 'true';
        if (expectedFormatted === 'false') expectedFormatted = 'false';

        harness += `\t{\n`;
        harness += `\t\tactual := ${callFormatted}\n`;
        harness += `\t\texpected := ${expectedFormatted}\n`;
        harness += `\t\tpassed := reflect.DeepEqual(actual, expected)\n`;
        harness += `\t\tfmt.Printf("{\\"passed\\": %t, \\"actual\\": \\"%v\\", \\"expected\\": \\"%v\\"}", passed, actual, expected)\n`;
        if (idx < testCases.length - 1) {
            harness += `\t\tfmt.Print(", ")\n`;
        }
        harness += `\t}\n`;
    });

    harness += `\tfmt.Println("]}")\n}\n`;
    return harness;
};

const runGo = (sessionDir, code, functionName, testCases, dockerVol) => {
    const goCode = generateGoHarness(code, functionName, testCases);
    fs.writeFileSync(path.join(sessionDir, "main.go"), goCode);
    const isWindows = process.platform === "win32";
    const binaryPath = path.join(sessionDir, isWindows ? "solution.exe" : "solution");

    const mainGoPath = path.join(sessionDir, "main.go").replace(/\\/g, "/");
    const normalBinaryPath = binaryPath.replace(/\\/g, "/");
    const execCmd = isWindows ? binaryPath.replace(/\//g, "\\") : normalBinaryPath;

    const dockerCmd = `docker run --rm -v "${dockerVol}:/app" golang:1.21-slim sh -c "go build -o /app/solution /app/main.go && /app/solution"`;
    const localCmd = `go build -o "${normalBinaryPath}" "${mainGoPath}" && "${execCmd}"`;

    return { dockerCmd, localCmd };
};

module.exports = { runGo };
