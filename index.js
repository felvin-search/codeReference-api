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

app.get("/api/code", (req, res) => {
  const query = req.query.searchQuery;
  const [algorithm, language] = query.split(" in ");
  let response;
  try {
    //check first if code snippets for the language and algorithm are available in the rosetta code file
    if (
      algorithms_code[language] === undefined ||
      algorithms_code[language][algorithm] === undefined
    ) {
      response = {
        code: rosetta_code[algorithm][language],
        language,
        source: "http://www.rosettacode.org/wiki/Rosetta_Code",
        name: "Rosetta code",
      };
    } else {
      //If not , use theTheAlgorithms json file

      response = {
        code: algorithms_code[language][algorithm],
        language,
        source: "https://the-algorithms.com",
        name: "The Algorithm",
      };
    }
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send({ res: "Query Not found" });
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
