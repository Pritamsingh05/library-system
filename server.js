const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./library.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// create table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      copies INTEGER NOT NULL DEFAULT 1
    )
  `);
});

// get all books
app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// add book
app.post("/api/books", (req, res) => {
  const { title, author, copies } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required" });
  }

  db.run(
    "INSERT INTO books (title, author, copies) VALUES (?, ?, ?)",
    [title, author, copies || 1],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        title,
        author,
        copies: copies || 1
      });
    }
  );
});

// delete book
app.delete("/api/books/:id", (req, res) => {
  db.run("DELETE FROM books WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Book deleted" });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});