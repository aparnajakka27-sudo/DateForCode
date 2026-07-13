const fs = require("fs");
const path = require("path");

const runSql = (sessionDir, code, functionName, testCases, dockerVol) => {
    // Write query to query.sql
    fs.writeFileSync(path.join(sessionDir, "query.sql"), code);

    // Standard platform schema for SQL challenges
    const seedSql = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, role TEXT, email TEXT);
INSERT OR IGNORE INTO users VALUES (1, 'Aarav Mehta', 'coder', 'aarav@dateforcode.com');
INSERT OR IGNORE INTO users VALUES (2, 'Priya Sharma', 'navigator', 'priya@dateforcode.com');
INSERT OR IGNORE INTO users VALUES (3, 'Admin Node', 'admin', 'admin@dateforcode.com');

CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, title TEXT, language TEXT);
INSERT OR IGNORE INTO projects VALUES (101, 'Sandbox Compiler', 'Node.js');
INSERT OR IGNORE INTO projects VALUES (102, 'Dating Matching Engine', 'Python');
`;
    fs.writeFileSync(path.join(sessionDir, "seed.sql"), seedSql);

    const isWindows = process.platform === "win32";
    const sqliteBinary = isWindows 
        ? `"C:\\Users\\Aparna\\AppData\\Local\\Microsoft\\WinGet\\Packages\\SQLite.SQLite_Microsoft.Winget.Source_8wekyb3d8bbwe\\sqlite3.exe"`
        : 'sqlite3';

    const dbPath = path.join(sessionDir, "data.db").replace(/\\/g, "/");
    const seedPath = path.join(sessionDir, "seed.sql").replace(/\\/g, "/");
    const queryPath = path.join(sessionDir, "query.sql").replace(/\\/g, "/");

    // Execute queries using sqlite3 command-line client with -json output flag
    const localCmd = `${sqliteBinary} "${dbPath}" < "${seedPath}" && ${sqliteBinary} -json "${dbPath}" < "${queryPath}"`;
    const dockerCmd = `docker run --rm --memory="64m" --cpus="0.2" --network="none" -v "${dockerVol}:/app" keinos/sqlite3 sqlite3 -json /app/data.db < /app/query.sql`;

    return { dockerCmd, localCmd };
};

module.exports = { runSql };
