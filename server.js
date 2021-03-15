// be sure to run
//npm install cors,
// npm install express, and
//npm install express-http-proxy

const express = require("express");
const proxy = require("express-http-proxy");

const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const url = "https://musicovery.com/api/V6";

app.use(
  "/",
  proxy(url, {
    userResHeaderDecorator: () => ({ "Access-Control-Allow-Origin": "*" }),
  })
);

app.listen(port, (_) => {
  console.log(`Listening on http://localhost:${port}`);
});