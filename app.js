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
run()
  .then(() => {
    console.log("DB tayyor, endi so'rovlarni qabul qilishi mumkin");
  })
  .catch((err) => {
    console.log("MongoDB ulanishida xato:", err);
  });
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
    res.send("successfully added");
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
});
app.get(`/author`, (req, res) => {
  res.render("author", { user: user });
});
app.get("/", async (req, res) => {
  try {
    if (!db) {
      return res
        .status(503)
        .json({
          message:
            "Server hali tayyor emas, birozdan keyin qayta urinib ko'ring",
        });
    }
    const items = await db.collection("items").find().toArray();
    console.log(items);
    res.render("reja1", { items: items });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
});
module.exports = app;
