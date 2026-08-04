const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "আপনার_MONGODB_LINK_এখানে_বসাবেন";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB Error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'patient' }
});

const AppointmentSchema = new mongoose.Schema({
    patientEmail: String,
    patientName: String,
    docName: String,
    docDept: String,
    date: String,
    time: String,
    problem: String,
    status: { type: String, default: 'Pending' }
});

const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: 'Email already exists' });

        const newUser = new User({ name, email, password, role: role || 'patient' });
        await newUser.save();
        res.json({ message: 'Registration Successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Appointment Routes
app.post('/api/appointments', async (req, res) => {
    try {
        const appData = new Appointment(req.body);
        await appData.save();
        res.json({ message: 'Appointment Booked' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ _id: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));