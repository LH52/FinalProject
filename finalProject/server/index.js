const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost', // later replace with Concordia DB
  user: 'root',
  password: '',
  database: 'test'
});

db.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log('MySQL Connected');
  }
});

app.get('/test', (req, res) => {
  res.json({ message: 'Backend working' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});