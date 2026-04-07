const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { runQuery, insertRow, updateRow  } = require("./db");

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

app.post("/delete-row", async (req, res) => {
  try {
    const { table, idAttribute, id } = req.body;

    if (!table || !idAttribute || !id) {
      return res.status(400).json({ error: "Table, idAttribute and id are required." });
    }

    const selectSql = `SELECT * FROM ${table} WHERE ${idAttribute} = ?`;
    const selectResult = await runQuery(selectSql, [id]);

    // if no matching id
    if (selectResult.length === 0) {
      return res.status(404).json({error: "No matching ID found."});
    }

    const deleteSql = `DELETE FROM ${table} WHERE ${idAttribute} = ?`;
    const deleteResult = await runQuery(deleteSql, [id]);

    res.json({
      message: "Row deleted successfully.",
      deleteResult,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/update-row", async (req, res) => {
  try {
    const { table, idAttribute, id, attribute, newValue } = req.body;

    if (!table || !idAttribute || !id || !attribute || newValue === undefined) {
      return res.status(400).json({ error: "Table, idAttribute, id, attribute, and newValue are required." });
    }

    const selectSql = `SELECT * FROM ${table} WHERE ${idAttribute} = ?`;
    const selectResult = await runQuery(selectSql, [id]);

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "No matching ID found." });
    }

    const result = await updateRow(table, idAttribute, id, attribute, newValue);
    res.json({ message: "Row updated successfully.", result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});