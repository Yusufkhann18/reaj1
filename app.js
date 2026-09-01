console.log("Web Serverni boshlash");
const express = require("express");
const app = express();

const fs = require("fs");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let db;
async function run() {
  await client.connect();
  db = client.db("reja1");
  console.log("MongoDB'ga muvaffaqiyatli ulandi!");
}
run();
let user;
fs.readFile("database/user.json", "utf8", (err, data) => {
  if (err) {
    console.log("ERROR:", err);
  } else {
    user = JSON.parse(data);
  }
});
// 1 Kirish kodlari
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 2: Session code

// 3 views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4 routing code
app.post("/create-item", async (req, res) => {
  try {
    console.log(req.body);
    const result = await db.collection("items").insertOne(req.body);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get(`/author`, (req, res) => {
  res.render("author", { user: user });
});
app.get(`/`, function (req, res) {
  res.render("reja1");
});
module.exports = app;
