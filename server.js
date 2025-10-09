const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'keynest'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
app.post('/api/login', (req, res) => {
    const { username, password, userType } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND user_type = ?';
    
    db.query(query, [username, password, userType], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            // Generate and send OTP (mock implementation)
            const otp = Math.floor(100000 + Math.random() * 900000);
            // In real implementation, send OTP via SMS
            console.log(`OTP for ${username}: ${otp}`);
            res.json({ success: true, message: 'OTP sent', userId: results[0].id });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/api/verify-otp', (req, res) => {
    const { userId, otp } = req.body;
    // Mock OTP verification (in real app, check against stored OTP)
    if (otp === '123456') { // Mock OTP
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
});

app.post('/api/forgot-password', (req, res) => {
    const { mobile } = req.body;
    // Mock OTP sending for password reset
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Password reset OTP for ${mobile}: ${otp}`);
    res.json({ success: true, message: 'OTP sent for password reset' });
});

app.post('/api/reset-password', (req, res) => {
    const { mobile, otp, newPassword } = req.body;
    // Mock password reset
    if (otp === '123456') { // Mock OTP
        const query = 'UPDATE users SET password = ? WHERE mobile = ?';
        db.query(query, [newPassword, mobile], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Password reset successful' });
        });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
});

app.get('/api/properties', (req, res) => {
    const query = 'SELECT * FROM properties';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.post('/api/payment', (req, res) => {
    const { propertyId, amount, upiId } = req.body;
    // Mock UPI payment processing
    // In real implementation, integrate with UPI API
    console.log(`Payment initiated: Property ${propertyId}, Amount ${amount}, UPI ${upiId}`);
    res.json({ success: true, transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase() });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
