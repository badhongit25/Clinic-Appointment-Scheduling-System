const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const { register, login } = require('./controllers/authController');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Clinic Appointment Scheduling API',
        timestamp: new Date().toISOString()
    });
});

// Backward-compatible direct auth routes at /api
app.post('/api/register', register);
app.post('/api/login', login);

// Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

// Serve Frontend in Production if built
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
const legacyDir = path.join(__dirname, '..', 'legacy_backup');

const fs = require('fs');
if (fs.existsSync(frontendDist)) {
    console.log(`📦 Serving React frontend from ${frontendDist}`);
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
} else if (fs.existsSync(path.join(__dirname, '..', 'index.html'))) {
    // Serve root HTML if React is not built yet
    app.use(express.static(path.join(__dirname, '..')));
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initDB();
        app.listen(PORT, () => {
            console.log(`🚀 Clinic Server is running on port ${PORT}`);
            console.log(`🔗 API Base: http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error('Failed to initialize server:', err);
    }
}

startServer();