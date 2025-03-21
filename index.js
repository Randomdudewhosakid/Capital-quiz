import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

var ran_num = 0
let total_right = 0
var quiz = []
const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "SkidMann2014",
  port: 5432,
})

db.connect();
db.query("select * from capitals", (err, res) => {
  if (err) {
    console.log("Error accessing database", err.stack);
  }
  else {
    quiz = res.rows
  }
}) 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  ran_num = Math.floor(Math.random() * 250)
  res.render("index.ejs", {country: quiz[ran_num].country, totalscore: total_right, playcorrect: "false"})
})
app.post("/submit", (req, res) => {
  if (req.body.capital === "") {
    res.render("index.ejs", {country: "Please enter a capital", totalscore: "", playcorrect: "false"})
  }
  else {
    let user_capital = req.body.capital.trim().toLowerCase()
    if (quiz[ran_num].capital.toLowerCase() == user_capital) {
      total_right ++
      ran_num = Math.floor(Math.random() * 250)
      res.render("index.ejs", {country: quiz[ran_num].country, totalscore: total_right, playcorrect: "true"})
    }
    else {
      res.render("wrong.ejs", {totalscore: total_right, playincorrect: "true"})
    }
  }
})
app.post("/restart", (req, res) => {
  total_right = 0
  ran_num = Math.floor(Math.random() * 250)
  res.render("index.ejs", {totalscore: total_right, country: quiz[ran_num].country, playcorrect: "false"})
})
app.listen(3000, (req, res) => {
  console.log("Listening on port 3000")
})
