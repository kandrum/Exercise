const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Parse incoming requests with JSON payloads

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'newadmin', // Use the new username
    password: 'Mou6pree',
    database: 'online_bookstore' // Ensure this matches your database name
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error in connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to the database');
    connection.release(); // Release the connection back to the pool
});

app.get('/test', (req, res) => {
    res.send('Welcome to online_bookstore');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
