const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, isLocalFallback, readLocalDb, writeLocalDb } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Register new user (Patient or Admin)
async function register(req, res) {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedRole = role === 'admin' ? 'admin' : 'patient';

    try {
        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
            if (existing.rows.length > 0) {
                return res.status(409).json({ message: 'Email is already registered. Please login.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                `INSERT INTO users (name, email, password, role)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, name, email, role, created_at`,
                [name.trim(), cleanEmail, hashedPassword, assignedRole]
            );

            const newUser = result.rows[0];
            const token = generateToken(newUser);
            return res.status(201).json({
                message: 'Account registered successfully!',
                user: newUser,
                token
            });
        } else {
            const db = readLocalDb();
            const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
            if (existing) {
                return res.status(409).json({ message: 'Email is already registered. Please login.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: db.users.length + 1,
                name: name.trim(),
                email: cleanEmail,
                password: hashedPassword,
                role: assignedRole,
                created_at: new Date().toISOString()
            };

            db.users.push(newUser);
            writeLocalDb(db);

            const { password: _, ...userWithoutPass } = newUser;
            const token = generateToken(newUser);

            return res.status(201).json({
                message: 'Account registered successfully!',
                user: userWithoutPass,
                token
            });
        }
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Registration failed due to server error.' });
    }
}

// Login user
async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
        let user = null;

        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
            if (result.rows.length > 0) {
                user = result.rows[0];
            }
        } else {
            const db = readLocalDb();
            user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const { password: _, ...userData } = user;
        const token = generateToken(userData);

        return res.json({
            message: 'Login successful!',
            user: userData,
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Login failed due to server error.' });
    }
}

// Get current profile
async function getMe(req, res) {
    return res.json({ user: req.user });
}

module.exports = {
    register,
    login,
    getMe
};
