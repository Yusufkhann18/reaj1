console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const http = require("http");
// 1 Kirish kodlari
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 2: Session code

// 3 views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 routing code
app.get("/hello", function (rew, res) {
  res.end(`<h1 style="background: red">Hello World by MICHAEL</h1>`);
});
app.get("/gift", function (rew, res) {
  res.end(`<h1 style="background: red">Siz sovgalar bolimidasiz</h1>`);
});

const server = http.createServer(app);
let PORT = 3000;
server.listen(PORT, function () {
  console.log(`The Server is running successfully on port: ${PORT}`);
});
