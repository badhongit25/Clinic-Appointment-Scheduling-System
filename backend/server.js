const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ডাটাবেজ কানেকশন (Render PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://badhon:sIu03dkyALWtq5HSL20joDVjVfMKuYFv@dpg-d9p6j237uimc73amafng-a/clinic_xqd0",
    ssl: { rejectUnauthorized: false }
});

// ইমেইল সার্ভিস (Nodemailer Transporter)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'badhon533@gmail.com',      // আপনার জিমেইল
        pass: 'YOUR_16_DIGIT_APP_PASSWORD' // আপনার ১৬ অক্ষরের Google App Password
    }
});

// ১. টেস্ট রুট
app.get('/', (req, res) => {
    res.send('Clinic Appointment API is running...');
});

// ২. অ্যাপয়েন্টমেন্ট বুকিং রুট (এখানেই ইমেইল সেন্ড হবে)
app.post('/api/appointments', async (req, res) => {
    const { name, email, doctor, date, time } = req.body;

    try {
        // ডাটাবেজে ডাটা ইনসার্ট
        const newAppointment = await pool.query(
            "INSERT INTO appointments (name, email, doctor, date, time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, email, doctor, date, time]
        );

        // ইমেইল কনফিগারেশন
        const mailOptions = {
            from: '"Clinic Appointment System" <badhon533@gmail.com>',
            to: email, 
            subject: 'Appointment Confirmation - Clinic System',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #2b6cb0;">Hello ${name},</h2>
                    <p>Your appointment has been <strong style="color: #38a169;">Successfully Booked!</strong></p>
                    <hr style="border: 0.5px solid #eee;">
                    <p><strong>Appointment Details:</strong></p>
                    <ul>
                        <li><strong>Doctor:</strong> ${doctor}</li>
                        <li><strong>Date:</strong> ${date}</li>
                        <li><strong>Time:</strong> ${time}</li>
                    </ul>
                    <hr style="border: 0.5px solid #eee;">
                    <p style="color: #718096; font-size: 13px;">Thank you for choosing our Medical Clinic Service.</p>
                </div>
            `
        };

        // ইমেইল পাঠানো
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email error:", error);
            } else {
                console.log("Email sent successfully: " + info.response);
            }
        });

        res.status(201).json({ 
            message: "Appointment booked & email sent!", 
            data: newAppointment.rows[0] 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ৩. সব অ্যাপয়েন্টমেন্ট দেখার রুট
app.get('/api/appointments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// অ্যাপয়েন্টমেন্ট রিমুভ করার API
app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
        res.json({ message: "Appointment cancelled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});