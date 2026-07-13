const fs = require("fs");
const path = require("path");

const generateJavaHarness = (userCode, funcName, testCases) => {
    let harness = "import java.util.*;\nimport java.util.stream.*;\n\n";
    
    // If the user code doesn't explicitly declare class Solution, wrap it in a class Solution
    let cleanUserCode = userCode.replace(/\bpublic\s+class\s+Solution\b/g, 'class Solution');
    if (!cleanUserCode.includes("class ")) {
        harness += `class Solution {\n${cleanUserCode}\n}\n\n`;
    } else {
        harness += cleanUserCode + "\n\n";
    }

    harness += `public class Main {\n`;
    harness += `    public static void main(String[] args) {\n`;
    harness += `        StringBuilder json = new StringBuilder();\n`;
    harness += `        json.append("{\\"results\\": [");\n`;
    harness += `        Solution solver = new Solution();\n`;

    testCases.forEach((tc, idx) => {
        let callStr = tc.input;
        // In java, strings should use double quotes instead of single quotes
        let javaInput = callStr.replace(/'/g, '"');
        let javaExpected = tc.expected.replace(/'/g, '"');

        harness += `        try {\n`;
        harness += `            var actual = solver.${funcName}(${javaInput});\n`;
        harness += `            var expected = ${javaExpected};\n`;
        harness += `            boolean passed = Objects.equals(actual, expected);\n`;
        harness += `            json.append(String.format("{\\"passed\\": %b, \\"actual\\": \\"%s\\", \\"expected\\": \\"%s\\"}", passed, String.valueOf(actual), String.valueOf(expected)));\n`;
        harness += `        } catch (Exception e) {\n`;
        harness += `            json.append("{\\"passed\\": false, \\"error\\": \\"Runtime Error\\"}");\n`;
        harness += `        }\n`;

        if (idx < testCases.length - 1) {
            harness += `        json.append(", ");\n`;
        }
    });

    harness += `        json.append("]}");\n`;
    harness += `        System.out.println(json.toString());\n`;
    harness += `    }\n`;
    harness += `}\n`;
    return harness;
};

const runJava = (sessionDir, code, functionName, testCases, dockerVol) => {
    const javaCode = generateJavaHarness(code, functionName, testCases);
    fs.writeFileSync(path.join(sessionDir, "Main.java"), javaCode);
    
    const mainJavaPath = path.join(sessionDir, "Main.java").replace(/\\/g, "/");
    const cpDir = sessionDir.replace(/\\/g, "/");
    
    const dockerCmd = `docker run --rm --memory="128m" --cpus="0.5" --network="none" -v "${dockerVol}:/app" openjdk:21-slim sh -c "javac /app/Main.java && java -cp /app Main"`;
    const localCmd = `javac "${mainJavaPath}" && java -cp "${cpDir}" Main`;

    return { dockerCmd, localCmd };
};

module.exports = { runJava };
