require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3000;
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect(process.env.DB_URL);

const client = new MongoClient(process.env.DB_URL);
const db = client.db("richardltyler");
const urls = db.collection("users");

const UserSchema = new Schema({
  username: String,
});

const User = mongoose.model("User", UserSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  const result = urls.find();
  const responseDoc = await result.toArray();

  if (responseDoc.length < 1) {
    res.json([{ _id: "", username: "" }]);
  } else {
    res.json(responseDoc);
  }
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
