const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
  }
});

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const allowedTables = {
  Customer: ["Cust_ID", "Cust_Name", "Cust_Address", "Cust_Phone_Num", "Cust_Type"],
  Reservation: ["Res_ID", "Res_Booking_Date", "Req_Vehicle_Type", "Req_Duration", "Cust_ID"],
  Invoice: ["Invoice_ID", "Invoice_Day", "Invoice_Pay_Method", "Invoice_Status", "Invoice_Amount", "Cust_ID"],
  Driver: ["Driver_ID", "Driver_First_Name", "Driver_Last_Name", "Driver_Lic_Type"],
  Truck: ["Truck_ID", "Vehicle_Type", "Curr_Odometer"],
  Mission: [
    "Mission_ID",
    "RDV_Loc",
    "Planned_Start_Date",
    "Planned_End_Date",
    "Actual_Start_Date",
    "Actual_End_Date",
    "Odometer_Before",
    "Odometer_After",
    "Driver_ID",
    "Invoice_ID",
    "Reservation_ID",
    "Truck_ID",
    "Mission_Status",
  ],
};

async function insertRow(table, row) {
  if (!allowedTables[table]) {
    throw new Error("Invalid table name.");
  }

  if (!row || typeof row !== "object") {
    throw new Error("Row data is required.");
  }

  const validColumns = allowedTables[table];
  const columns = Object.keys(row).filter((key) => validColumns.includes(key));

  if (columns.length === 0) {
    throw new Error("No valid columns provided.");
  }

  const values = columns.map((col) => row[col]);
  const placeholders = columns.map(() => "?").join(", ");

  const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;

  return await runQuery(sql, values);
}

module.exports = { runQuery, insertRow };