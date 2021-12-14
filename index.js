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
  console.log(req.query);
  const query = req.query.searchQuery;
  const [algorithm, language] = query.split(" in ");
  let code_snippet;
  try {
    //check first if code snippets for the language and algorithm are available in the TheAlgorithms json file
    if (
      algorithms_code[language] === undefined ||
      algorithms_code[language][algorithm] === undefined
    ) {
      code_snippet = rosetta_code[algorithm][language];
      console.log(code_snippet);
    } else {
      //If not , use the rosetta code file
      code_snippet = algorithms_code[language][algorithm];
    }
    const response = { code: code_snippet, language: language };
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
