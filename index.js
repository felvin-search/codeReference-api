const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const code = require("./code.json");

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));

app.get("/api/query", (req, res) => {
  const [algorithm, language] = req.body.query;
  res.send(code[algorithm][language]);//
});

PORT = process.env.port || process.env.PORT || 5000;
app.listen(PORT, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
  }
});
