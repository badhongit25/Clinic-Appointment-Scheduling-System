const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// PostgreSQL connection pool
let pool = null;
let useLocalFallback = false;

// Local fallback DB file path
const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'local_db.json');

function ensureLocalDbFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_FILE)) {
        const initialData = {
            users: [],
            doctors: [],
            appointments: []
        };
        fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(initialData, null, 2));
    }
}

function readLocalDb() {
    ensureLocalDbFile();
    try {
        const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { users: [], doctors: [], appointments: [] };
    }
}

function writeLocalDb(data) {
    ensureLocalDbFile();
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2));
}

// Initial default doctors
const DEFAULT_DOCTORS = [
    {
        name: 'Dr. Sarah Jenkins',
        specialty: 'Cardiologist',
        department: 'Cardiology',
        experience: '12+ Years',
        available_days: 'Mon, Wed, Fri',
        available_time: '10:00 AM - 02:00 PM'
    },
    {
        name: 'Dr. Rafiqul Islam',
        specialty: 'Neurologist',
        department: 'Neurology',
        experience: '15+ Years',
        available_days: 'Sun, Tue, Thu',
        available_time: '11:00 AM - 03:00 PM'
    },
    {
        name: 'Dr. Emily Watson',
        specialty: 'Dermatologist',
        department: 'Dermatology',
        experience: '8+ Years',
        available_days: 'Mon - Thu',
        available_time: '02:00 PM - 06:00 PM'
    },
    {
        name: 'Dr. Tanvir Ahmed',
        specialty: 'General Physician',
        department: 'General Medicine',
        experience: '10+ Years',
        available_days: 'Everyday',
        available_time: '09:00 AM - 01:00 PM'
    },
    {
        name: 'Dr. Michael Chen',
        specialty: 'Orthopedic Surgeon',
        department: 'Orthopedics',
        experience: '14+ Years',
        available_days: 'Mon, Tue, Sat',
        available_time: '01:00 PM - 05:00 PM'
    }
];

async function initDB() {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
        try {
            pool = new Pool({
                connectionString,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 5000
            });

            // Test connection
            await pool.query('SELECT NOW()');
            console.log('✅ PostgreSQL Database connected successfully!');

            // Create Tables if not exist
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'patient',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS doctors (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    specialty VARCHAR(100) NOT NULL,
                    department VARCHAR(100) NOT NULL,
                    experience VARCHAR(50) DEFAULT '5+ years',
                    available_days VARCHAR(100) DEFAULT 'Mon - Sat',
                    available_time VARCHAR(100) DEFAULT '10:00 AM - 04:00 PM',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS appointments (
                    id SERIAL PRIMARY KEY,
                    patient_name VARCHAR(100) NOT NULL,
                    patient_email VARCHAR(150) NOT NULL,
                    doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
                    doctor_name VARCHAR(100) NOT NULL,
                    doctor_dept VARCHAR(100) NOT NULL,
                    appointment_date VARCHAR(50) NOT NULL,
                    appointment_time VARCHAR(50) NOT NULL,
                    problem TEXT,
                    status VARCHAR(20) DEFAULT 'Pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Seed initial doctors if empty
            const docCheck = await pool.query('SELECT COUNT(*) FROM doctors');
            if (parseInt(docCheck.rows[0].count, 10) === 0) {
                for (const doc of DEFAULT_DOCTORS) {
                    await pool.query(
                        `INSERT INTO doctors (name, specialty, department, experience, available_days, available_time)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [doc.name, doc.specialty, doc.department, doc.experience, doc.available_days, doc.available_time]
                    );
                }
                console.log('🌱 Seeded default doctors into PostgreSQL.');
            }

            // Seed default admin account if empty
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@clinic.com';
            const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
            if (adminCheck.rows.length === 0) {
                const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
                const hashedPass = await bcrypt.hash(adminPass, 10);
                await pool.query(
                    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
                    ['Clinic Administrator', adminEmail, hashedPass, 'admin']
                );
                console.log(`🌱 Default admin created: ${adminEmail} (password: ${adminPass})`);
            }

            return;
        } catch (err) {
            console.warn('⚠️ Could not connect to PostgreSQL. Falling back to local embedded JSON database.');
            console.warn(`Reason: ${err.message}`);
            useLocalFallback = true;
        }
    } else {
        console.log('ℹ️ No DATABASE_URL provided. Using reliable local JSON storage.');
        useLocalFallback = true;
    }

    // Initialize local JSON DB
    const db = readLocalDb();
    if (!db.doctors || db.doctors.length === 0) {
        db.doctors = DEFAULT_DOCTORS.map((doc, idx) => ({ id: idx + 1, ...doc, created_at: new Date().toISOString() }));
    }
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@clinic.com';
    const adminExists = db.users.find(u => u.email === adminEmail);
    if (!adminExists) {
        const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPass = await bcrypt.hash(adminPass, 10);
        db.users.push({
            id: db.users.length + 1,
            name: 'Clinic Administrator',
            email: adminEmail,
            password: hashedPass,
            role: 'admin',
            created_at: new Date().toISOString()
        });
    }
    writeLocalDb(db);
    console.log('✅ Local JSON database initialized successfully!');
}

module.exports = {
    initDB,
    getPool: () => pool,
    isLocalFallback: () => useLocalFallback,
    readLocalDb,
    writeLocalDb
};
