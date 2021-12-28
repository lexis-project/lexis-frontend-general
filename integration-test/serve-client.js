const express = require("express");
const path = require("path");

const app = express();

//serve static content of React app
app.use(express.static(path.join(__dirname, "build/")));

//handle any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(3000);

console.log(`App is listening with prefix 3000`);
