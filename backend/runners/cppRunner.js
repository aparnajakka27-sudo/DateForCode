const fs = require("fs");
const path = require("path");

const generateCppHarness = (userCode, funcName, testCases) => {
    let harness = `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <numeric>\n\nusing namespace std;\n\n${userCode}\n\n`;

    harness += `
template<typename T>
void printVal(const T& val) {
    cout << val;
}

template<typename T>
void printVal(const vector<T>& v) {
    cout << "{";
    for(size_t i = 0; i < v.size(); ++i) {
        cout << v[i];
        if(i < v.size() - 1) cout << ",";
    }
    cout << "}";
}

template<typename T>
bool isEqual(const T& a, const T& b) {
    return a == b;
}
\n`;

    harness += `int main() {\n    cout << "{\\"results\\": [";\n`;

    testCases.forEach((tc, idx) => {
        let callStr = tc.input;
        if (!callStr.trim().startsWith(funcName)) {
            callStr = `${funcName}(${tc.input})`;
        }

        let expectedValue = tc.expected;
        if (expectedValue === 'true') expectedValue = 'true';
        if (expectedValue === 'false') expectedValue = 'false';

        harness += `    {\n        try {\n`;
        harness += `            auto actual = ${callStr};\n`;
        harness += `            decltype(actual) expected = ${expectedValue};\n`;
        harness += `            cout << "{\\"passed\\": " << (isEqual(actual, expected) ? "true" : "false") << ", \\"actual\\": \\"";\n`;
        harness += `            printVal(actual);\n`;
        harness += `            cout << "\\", \\"expected\\": \\"";\n`;
        harness += `            printVal(expected);\n`;
        harness += `            cout << "\\"}"`;
        if (idx < testCases.length - 1) {
            harness += ` << ", ";\n`;
        } else {
            harness += `;\n`;
        }
        harness += `        } catch(...) {\n`;
        harness += `            cout << "{\\"passed\\": false, \\"error\\": \\"Runtime Error\\"}";\n`;
        if (idx < testCases.length - 1) {
            harness += `            cout << ", ";\n`;
        }
        harness += `        }\n    }\n`;
    });

    harness += `    cout << "]}";\n    return 0;\n}\n`;
    return harness;
};

const runCpp = (sessionDir, code, functionName, testCases, dockerVol) => {
    const cppCode = generateCppHarness(code, functionName, testCases);
    fs.writeFileSync(path.join(sessionDir, "main.cpp"), cppCode);
    const isWindows = process.platform === "win32";
    const binaryPath = path.join(sessionDir, isWindows ? "solution.exe" : "solution");
    
    const mainCppPath = path.join(sessionDir, "main.cpp").replace(/\\/g, "/");
    const normalBinaryPath = binaryPath.replace(/\\/g, "/");
    const execCmd = isWindows ? binaryPath.replace(/\//g, "\\") : normalBinaryPath;
    
    const dockerCmd = `docker run --rm -v "${dockerVol}:/app" gcc:latest sh -c "g++ -O3 /app/main.cpp -o /app/solution && /app/solution"`;
    const localCmd = `g++ -O3 "${mainCppPath}" -o "${normalBinaryPath}" && "${execCmd}"`;

    return { dockerCmd, localCmd };
};

module.exports = { runCpp };
