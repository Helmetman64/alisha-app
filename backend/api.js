// Import required modules
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

// Create an instance of express
const app = express();


// Database configuration
const dbConfig = {
    user: 'admin',
    password: 'AlishaDB',
    server: 'database-1.cz84m4ky8zu0.ap-southeast-2.rds.amazonaws.com', // Change this to your AWS SQL Server endpoint
    database: 'ALISHA',
    options: {
        trustServerCertificate: true
    }
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to the database
sql.connect(dbConfig, err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MSSQL database.');
});

// Define your API routes
app.get('/items', (req, res) => {
    // Query to retrieve users from the database
    const query = 'SELECT * FROM ITEMS';

    // Execute the query
    sql.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving users from database.');
            return;
        }
        // Send the result as JSON
        res.json(result.recordset);
    });
});

app.post('/items', (req, res) => {

    const { itemID, itemName, itemPrice, itemQTY} = req.body;

    const query = `INSERT INTO ITEMS (itemID, itemName, itemPrice, itemQTY) VALUES ('${itemID}', '${itemName}', '${itemPrice}', '${itemQTY}')`;

    const params = [itemID, itemName, itemPrice, itemQTY];

    sql.query(query, params, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error inserting user into database.');
            return;
        }
        res.status(201).send('User inserted successfully.');
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
