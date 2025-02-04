const express = require('express');
const mysql = require('mysql2');
const config = require('config');
const router = express.Router();

const connectionDetails = {
    host: config.get('host'),
    user: config.get('user'),
    password: config.get('password'),
    database: config.get('database'),
};



router.get('/paymentdetails/:stdId', (req, res) => {
    const stdId = req.params.stdId; // Extract student ID from URL
    const sql = `SELECT * FROM paymentdetails WHERE stdId = ?`; // SQL Query with placeholder

    console.log(sql);

    // Create a new connection
    const connection = mysql.createConnection(connectionDetails);

    connection.connect((connectError) => {
        if (connectError) {
            console.error('Database connection error:', connectError.message);
            res.status(500).json({
                status: 'error',
                message: 'Database connection failed',
                errorMessage: connectError.message
            });
            return;
        }

        // Query the database
        connection.query(sql, [stdId], (queryError, result) => {
            if (queryError) {
                console.error('Database query error:', queryError.message);
                res.status(500).json({
                    status: 'error',
                    message: 'Something went wrong...',
                    errorMessage: queryError.message
                });
            } else if (result.length === 0) {
                res.status(404).json({
                    status: 'error',
                    message: `No payment details found for student ID: ${stdId}`
                });
            } else {
                res.status(200).json({
                    status: 'success',
                    data: result
                });
            }

            // End the connection after query
            connection.end((endError) => {
                if (endError) {
                    console.error('Error closing the connection:', endError.message);
                }
            });
        });
    });
});


module.exports = router;
