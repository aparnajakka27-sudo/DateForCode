const fs = require("fs");
const path = require("path");

const runPython = (sessionDir, code, functionName, testCases, dockerVol) => {
    fs.writeFileSync(path.join(sessionDir, "solution.py"), code);

    const pyHarness = `
import json
import sys
import os

try:
    harness_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = '/app/config.json' if os.path.exists('/app/config.json') else os.path.join(harness_dir, 'config.json')
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Enable loading solution from the harness directory dynamically
    sys.path.append(harness_dir)
    import solution
except Exception as e:
    print(json.dumps({"error": f"Syntax/Compile Error: {str(e)}"}))
    sys.exit(1)

func_name = config.get("functionName")
test_cases = config.get("testCases", [])
results = []

if not hasattr(solution, func_name):
    print(json.dumps({"error": f"Function '{func_name}' is not defined. Please implement 'def {func_name}(...)'."}))
    sys.exit(1)

for tc in test_cases:
    try:
        if func_name in ['LFUCache', 'MedianFinder', 'NumMatrix', 'WordFilter']:
            inputs = eval(f"({tc['input']})")
            methods = inputs[0]
            params = inputs[1]
            run_results = []
            
            instance = None
            for i, method in enumerate(methods):
                param_list = params[i]
                if i == 0:
                    ClassRef = getattr(solution, func_name)
                    instance = ClassRef(*param_list)
                    run_results.append(None)
                else:
                    method_func = getattr(instance, method)
                    res = method_func(*param_list)
                    run_results.append(res)
            actual = run_results
        else:
            actual = eval(f"solution.{func_name}({tc['input']})")

        expected_str = tc['expected']
        try:
            expected_eval = eval(expected_str)
        except Exception:
            expected_eval = expected_str

        passed = (actual == expected_eval)
        results.append({
            "passed": passed,
            "actual": json.dumps(actual) if isinstance(actual, (list, dict, bool)) else str(actual),
            "expected": json.dumps(expected_eval) if isinstance(expected_eval, (list, dict, bool)) else str(expected_eval)
        })
    except Exception as e:
        results.append({
            "passed": False,
            "error": str(e)
        })

print(json.dumps({"results": results}))
`;
    fs.writeFileSync(path.join(sessionDir, "harness.py"), pyHarness);
    const isWindows = process.platform === "win32";
    const dockerCmd = `docker run --rm -v "${dockerVol}:/app" python:3.11-slim python /app/harness.py`;
    const localCmd = `${isWindows ? "py" : "python3"} "${path.join(sessionDir, "harness.py")}"`;

    return { dockerCmd, localCmd };
};

module.exports = { runPython };
