import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);

  // Test backend connection
  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>RENTRUCK Management System</h1>

      {/* Customers Section */}
      <h2>Customers</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>ABC Logistics</td>
            <td>Enterprise</td>
            <td>Montreal</td>
          </tr>
        </tbody>
      </table>

      {/* Reservation Form */}
      <h2>Create Reservation</h2>
      <form>
        <input placeholder="Customer ID" /><br /><br />
        <input placeholder="Vehicle Type" /><br /><br />
        <input placeholder="Rendezvous" /><br /><br />
        <input type="date" /><br /><br />
        <input type="time" /><br /><br />
        <input placeholder="Duration" /><br /><br />
        <button type="submit">Submit</button>
      </form>

      {/* Queries Section */}
      <h2>Queries</h2>
      <button>Run Query A</button>
      <button>Run Query B</button>

      <div style={{ marginTop: "20px" }}>
        <h3>Results:</h3>
        <div style={{ border: "1px solid black", padding: "10px" }}>
          Output will appear here
        </div>
      </div>
    </div>
  );
}