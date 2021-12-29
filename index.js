const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rosetta_code = require("./rosetta-code-snippets.json");
const algorithms_code = require("./the-algorithms-snippets.json");

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));

let db = new sqlite3.Database("./snippets.db", err => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the snippets database.");
});

app.get("/api/code", (req, res) => {
    const query = req.query.searchQuery;
    let [algorithm, language] = query.split(" in ");
    let response;
    if (!language) {
        language = "javascript";
    }
    try {
        //check first if code snippets for the language and algorithm are available in the rosetta code file
        if (algorithms_code[language] === undefined || algorithms_code[language][algorithm] === undefined) {
            response = {
                algorithm,
                code: rosetta_code[algorithm][language],
                language,
                source: "http://www.rosettacode.org/wiki/Rosetta_Code",
                name: "Rosetta code",
            };
        } else {
            //If not , use theTheAlgorithms json file

            response = {
                algorithm,
                code: algorithms_code[language][algorithm],
                language,
                source: "https://the-algorithms.com",
                name: "The Algorithm",
            };
        }
        res.status(200).send(response);
    } catch (err) {
        res.status(404).send({res: "Query Not found"});
    }
});

app.get("/createTable", (req, res) => {
    try {
        db.run(
            "CREATE TABLE IF NOT EXISTS snippets (algorithm varchar(255),language varchar(255),snippet varchar,source varchar,name varchar)"
        );
        res.send({status: "Table Created"}).status(200);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

app.get("/algorithmsCode", (req, res) => {
    try {
        function fill_db() {
            for (lang of Object.keys(algorithms_code)) {
                for (algo of Object.keys(algorithms_code[lang])) {
                    db.run("INSERT INTO snippets(algorithm,language,snippet,source,name) values(?,?,?,?,?)", [
                        algo,
                        lang,
                        algorithms_code[lang][algo],
                        "https://the-algorithms.com",
                        "The Algorithm",
                    ]);
                }
            }
        }

        fill_db();
        res.send({status: "algorithms code data filled"}).status(200);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

app.get("/rosettaCode", (req, res) => {
    try {
        function fill_db() {
            for (algo of Object.keys(rosetta_code)) {
                for (lang of Object.keys(rosetta_code[algo])) {
                    db.run("INSERT INTO snippets(algorithm,language,snippet,source,name) values(?,?,?,?,?)", [
                        algo,
                        lang,
                        rosetta_code[algo][lang],
                        "http://www.rosettacode.org/wiki/Rosetta_Code",
                        "Rosetta code",
                    ]);
                }
            }
        }

        fill_db();
        res.send({status: "Rosetta code data filled"}).status(200);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});

app.get("/api/sql", (req, res) => {
    try {
        const query = req.query.searchQuery;
        let [algorithm, language] = query.split(" in ");
        if (!language) {
            language = "javascript";
        }
        console.log(algorithm, language);
        db.all("SELECT * FROM snippets WHERE algorithm=? and language=?", [algorithm, language], (err, rows) => {
            db.all("SELECT language FROM snippets WHERE algorithm=?", [algorithm], (err, lang_row) => {
                let languages = [];
                lang_row.forEach(e => {
                    languages.push(e.language);
                });
                res.send({
                    snippet: rows[0].snippet,
                    source: rows[0].source,
                    name: rows[0].name,
                    algorithm,
                    language,
                    languages,
                });
            });
        });
    } catch (err) {
        res.send({Error: err.message}).status(401);
    }
});

app.get("/createIndex", (req, res) => {
    try {
        db.run("CREATE INDEX idx_algorithm ON snippets (algorithm)");
        res.status(200).send({status: "Index created"});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});


PORT = process.env.port || process.env.PORT || 5000;
app.listen(PORT, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`SERVER RUNNING ON PORT ${PORT}`);
    }
});
