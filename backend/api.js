// Import required modules
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

// Create an instance of express
const app = express();

// Database configuration
const dbConfig = {
  user: "admin",
  password: "AlishaDB",
  server: "database-1.cz84m4ky8zu0.ap-southeast-2.rds.amazonaws.com", // Change this to your AWS SQL Server endpoint
  database: "ALISHA",
  options: {
    trustServerCertificate: true,
  },
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to the database
sql.connect(dbConfig, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MSSQL database.");
});

// Define your API routes

// Get all items
app.get("/items", (req, res) => {
  // Query to retrieve items from the database
  const query = "SELECT * FROM Items";

  // Execute the query
  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving items from database.");
      return;
    }
    // Send the result as JSON
    res.json(result.recordset);
  });
});

// Add a new item
app.post("/items", (req, res) => {
  const { itemID, itemName, itemPrice, itemQTY } = req.body;

  const query = `INSERT INTO Items (itemID, itemName, itemPrice, itemQTY) VALUES ('${itemID}', '${itemName}', '${itemPrice}', '${itemQTY}')`;

  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error inserting item into database.");
      return;
    }
    res.status(201).send("Item inserted successfully.");
  });
});

// Update stock quantity for a specific item
app.put("/items/:itemID", (req, res) => {
  const { itemID } = req.params;
  const { newQuantity } = req.body;

  // Call the stored procedure to update the stock quantity
  const request = new sql.Request();
  request.input("itemID", sql.Int, itemID);
  request.input("newQuantity", sql.Int, newQuantity);

  request.execute("UpdateStockQuantity", (err, result) => {
    if (err) {
      console.error("Error executing stored procedure:", err);
      res.status(500).send("Error updating stock quantity.");
      return;
    }
    res.status(200).send("Stock quantity updated successfully.");
  });
});

// Get all sales records
app.get("/sales", (req, res) => {
  // Query to retrieve items from the database
  const query = "SELECT * FROM Sales";

  // Execute the query
  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error retrieving items from database.");
      return;
    }
    // Send the result as JSON
    res.json(result.recordset);
  });
});

// POST endpoint to record a sale
app.post("/sales", (req, res) => {
  const { itemID, itemName, salePrice, qtySold, saleDate } = req.body;

  // Call the stored procedure to record the sale
  const query = `EXEC RecordSale @itemID = @itemID, @itemName = @itemName, @salePrice = @salePrice, @qtySold = @qtySold, @saleDate = @saleDate`;

  const request = new sql.Request();
  request.input("itemID", sql.Int, itemID);
  request.input("itemName", sql.NVarChar(100), itemName);
  request.input("salePrice", sql.Money, salePrice);
  request.input("qtySold", sql.Int, qtySold);
  request.input("saleDate", sql.Date, saleDate);

  request.execute("RecordSale", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error recording sale.");
      return;
    }
    res.status(201).json({ message: "Sale recorded successfully." });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
