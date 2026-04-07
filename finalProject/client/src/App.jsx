import React, { useState } from "react";
import "./App.css";

const schema = {
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

export default function App() {
  const [selectedTable, setSelectedTable] = useState("Customer");
  const [selectedView, setSelectedView] = useState("add");
  const [selectedAttribute, setSelectedAttribute] = useState(schema.Customer[1]);

  const [queryText, setQueryText] = useState("SELECT * FROM Customer;");
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState("");
  const [loadingQuery, setLoadingQuery] = useState(false);

  const [formData, setFormData] = useState({});

  const fields = schema[selectedTable];

  function handleTableChange(table) {
    setSelectedTable(table);
    setSelectedAttribute(schema[table][1] || schema[table][0]);
  }

  function handleInputChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleExecuteQuery() {
    setLoadingQuery(true);
    setQueryError("");
    setQueryResults(null);

    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: queryText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Query failed");
      }

      setQueryResults(data);
    } catch (error) {
      setQueryError(error.message);
    } finally {
      setLoadingQuery(false);
    }
  }

  async function handleInsertRow() {
    try {
      const response = await fetch("http://localhost:5000/add-row", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: selectedTable,
          row: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Insert failed");
      }

      console.log("Insert success:", data);
      alert("Row inserted successfully");

      setFormData({});
    } catch (error) {
      console.error("Insert error:", error);
      alert(error.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>RENTRUCK</h1>
        <p className="sidebar-subtitle">Database UI Navigation</p>

        <div className="sidebar-section">
          <h3>Tables</h3>
          <div className="table-nav">
            {Object.keys(schema).map((table) => (
              <button
                key={table}
                className={selectedTable === table ? "nav-btn active" : "nav-btn"}
                onClick={() => handleTableChange(table)}
              >
                {table}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h2>{selectedTable} Interface</h2>
            <p>UI only for now. Focused on CRUD navigation and query execution.</p>
          </div>
        </header>

        <section className="mode-switcher panel">
          <h3>Choose an Operation</h3>
          <div className="mode-buttons">
            <button className={selectedView === "add" ? "mode-btn active-mode" : "mode-btn"} onClick={() => setSelectedView("add")}>Add Row</button>
            <button className={selectedView === "delete" ? "mode-btn active-mode" : "mode-btn"} onClick={() => setSelectedView("delete")}>Delete Row</button>
            <button className={selectedView === "update" ? "mode-btn active-mode" : "mode-btn"} onClick={() => setSelectedView("update")}>Update Attribute</button>
            <button className={selectedView === "read" ? "mode-btn active-mode" : "mode-btn"} onClick={() => setSelectedView("read")}>Read (SQL Query)</button>
          </div>
        </section>

        {selectedView === "add" && (
          <section className="panel operation-panel">
            <h3>Add a New Row to {selectedTable}</h3>
            <div className="form-grid">
              {fields.map((field) => (
                <div className="field-group" key={field}>
                  <label>{field}</label>
                  <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={formData[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="mock-action-row">
              <button className="primary-btn" onClick={handleInsertRow}>
                Add Row
              </button>
            </div>
          </section>
        )}

        {selectedView === "delete" && (
          <section className="panel operation-panel">
            <h3>Delete a Row from {selectedTable}</h3>
            <div className="single-form-wrap">
              <div className="field-group narrow-field">
                <label>{fields[0]} (Primary Key)</label>
                <input type="text" placeholder={`Enter ${fields[0]}`} />
              </div>
            </div>
            <div className="mock-action-row">
              <button className="danger-btn">Delete Row</button>
            </div>
          </section>
        )}

        {selectedView === "update" && (
          <section className="panel operation-panel">
            <h3>Update an Attribute in {selectedTable}</h3>
            <div className="update-layout">
              <div className="field-group">
                <label>{fields[0]} (Primary Key)</label>
                <input type="text" placeholder={`Enter ${fields[0]}`} />
              </div>

              <div className="field-group">
                <label>Attribute</label>
                <select value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.target.value)}>
                  {fields.slice(1).map((field) => (
                    <option key={field}>{field}</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>New Value</label>
                <input type="text" placeholder="Enter new value" />
              </div>
            </div>
            <div className="mock-action-row">
              <button className="primary-btn">Update</button>
            </div>
          </section>
        )}

        {selectedView === "read" && (
          <section className="panel operation-panel">
            <h3>Run SQL Query</h3>
            <p className="section-description">Write any SQL SELECT query to read data from the database.</p>

            <div className="query-box">
              <textarea
                placeholder="e.g. SELECT * FROM Customer;"
                className="query-input"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
              />
            </div>

            <div className="mock-action-row">
              <button className="primary-btn" onClick={handleExecuteQuery} disabled={loadingQuery}>
                {loadingQuery ? "Executing..." : "Execute Query"}
              </button>
            </div>

            <div className="read-preview-box">
              <h4>Query Results</h4>

              {queryError && <p className="error-text">{queryError}</p>}

              {!queryError && queryResults && Array.isArray(queryResults) && queryResults.length > 0 && (
                <div className="results-scroll-x">
                  <div className="preview-table-placeholder">
                    <div
                      className="preview-header-row"
                      style={{ gridTemplateColumns: `repeat(${Object.keys(queryResults[0]).length}, minmax(180px, 1fr))` }}
                    >
                      {Object.keys(queryResults[0]).map((column) => (
                        <span key={column}>{column}</span>
                      ))}
                    </div>

                    {queryResults.map((row, index) => (
                      <div
                        className="preview-header-row"
                        key={index}
                        style={{ gridTemplateColumns: `repeat(${Object.values(row).length}, minmax(180px, 1fr))` }}
                      >
                        {Object.values(row).map((value, valueIndex) => (
                          <span key={valueIndex}>{String(value)}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!queryError && Array.isArray(queryResults) && queryResults.length === 0 && (
                <p>No rows returned.</p>
              )}

              {!queryError && queryResults === null && (
                <p>Results will appear here after connecting to backend.</p>
              )}
            </div>
          </section>
        )}

        <section className="panel preview-panel">
          <h3>{selectedTable} Schema</h3>
          <div className="schema-list">
            {fields.map((field, index) => (
              <div key={field} className={index === 0 ? "schema-pill primary-key" : "schema-pill"}>
                {field} {index === 0 ? "(PK)" : ""}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}