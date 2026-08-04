const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// Render PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Render PostgreSQL-এর জন্য প্রয়োজনীয়
    }
});

// ডাটাবেজ টেবিল তৈরি করার ফাংশন
const initDB = async () => {
    try {
        // Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'patient'
            );
        `);

        // Appointments Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                patientName VARCHAR(100),
                patientEmail VARCHAR(100),
                doctor VARCHAR(100),
                date VARCHAR(50),
                time VARCHAR(50),
                symptoms TEXT
            );
        `);
        console.log('PostgreSQL Tables Created Successfully');
    } catch (err) {
        console.error('Database Init Error:', err);
    }
};

initDB();

// --- API ROUTES ---

// Register Route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Appointment Route
app.post('/api/appointments', async (req, res) => {
    const { patientName, patientEmail, doctor, date, time, symptoms } = req.body;
    try {
        const newAppointment = await pool.query(
            'INSERT INTO appointments (patientName, patientEmail, doctor, date, time, symptoms) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [patientName, patientEmail, doctor, date, time, symptoms]
        );
        res.status(201).json({ message: 'Appointment booked!', appointment: newAppointment.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Appointments Route
app.get('/api/appointments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});