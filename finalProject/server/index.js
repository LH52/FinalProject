const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { runQuery, insertRow  } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Backend working" });
});

app.post("/query", async (req, res) => {
  try {
    const { sql } = req.body;
    console.log("Received SQL query:", sql);

    if (!sql || typeof sql !== "string") {
      return res.status(400).json({ error: "SQL query is required." });
    }

    const trimmedSql = sql.trim().toUpperCase();

    if (!trimmedSql.startsWith("SELECT")) {
      return res.status(400).json({ error: "Only SELECT queries are allowed here." });
    }

    const results = await runQuery(sql);
    res.json(results);
  } catch (error) {
    console.error("Query execution error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/add-row", async (req, res) => {
  try {
    const { table, row } = req.body;

    if (!table || !row) {
      return res.status(400).json({ error: "Table and row are required." });
    }

    const result = await insertRow(table, row);

    res.json({
      message: "Row inserted successfully.",
      result,
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});