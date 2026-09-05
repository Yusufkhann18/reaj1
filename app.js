console.log("Web Serverni boshlash");
const express = require("express");
const app = express();

const fs = require("fs");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

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
    const new_reja = req.body.reja;

    const result = await db.collection("items").insertOne({
      reja: new_reja,
    });

    res.json({
      _id: result.insertedId,
      reja: new_reja,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/delete-item", async (req, res) => {
  try {
    const id = req.body.id;

    console.log("TERMINALGA KELGAN ID:", id);

    const result = await db.collection("items").deleteOne({
      _id: new ObjectId(id),
    });

    console.log("O'CHIRILGAN SON:", result.deletedCount);

    res.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get(`/author`, (req, res) => {
  res.render("author", { user: user });
});
app.get("/", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        message: "Server hali tayyor emas, birozdan keyin qayta urinib ko'ring",
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
