const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const code = require("./rosetta-code-snippets.json");

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));

app.get("/api/code", (req, res) => {
  const query = req.query.searchQuery;
  const [algorithm, language] = query.split(" in ");
  try {
    const response = { code: code[algorithm][language], language: language };
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
