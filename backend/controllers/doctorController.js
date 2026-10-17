const { getPool, isLocalFallback, readLocalDb, writeLocalDb } = require('../config/db');

// Get all doctors
async function getDoctors(req, res) {
    try {
        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const result = await pool.query('SELECT * FROM doctors ORDER BY id ASC');
            return res.json(result.rows);
        } else {
            const db = readLocalDb();
            return res.json(db.doctors || []);
        }
    } catch (err) {
        console.error('Error fetching doctors:', err);
        return res.status(500).json({ message: 'Failed to fetch doctors.' });
    }
}

// Add new doctor (Admin only)
async function createDoctor(req, res) {
    const { name, specialty, department, experience, available_days, available_time } = req.body;

    if (!name || !specialty || !department) {
        return res.status(400).json({ message: 'Name, specialty, and department are required.' });
    }

    try {
        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const result = await pool.query(
                `INSERT INTO doctors (name, specialty, department, experience, available_days, available_time)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    name.trim(),
                    specialty.trim(),
                    department.trim(),
                    experience || '5+ years',
                    available_days || 'Mon - Sat',
                    available_time || '10:00 AM - 04:00 PM'
                ]
            );
            return res.status(201).json(result.rows[0]);
        } else {
            const db = readLocalDb();
            const newDoc = {
                id: (db.doctors.length ? Math.max(...db.doctors.map(d => d.id)) : 0) + 1,
                name: name.trim(),
                specialty: specialty.trim(),
                department: department.trim(),
                experience: experience || '5+ years',
                available_days: available_days || 'Mon - Sat',
                available_time: available_time || '10:00 AM - 04:00 PM',
                created_at: new Date().toISOString()
            };
            db.doctors.push(newDoc);
            writeLocalDb(db);
            return res.status(201).json(newDoc);
        }
    } catch (err) {
        console.error('Error adding doctor:', err);
        return res.status(500).json({ message: 'Failed to add doctor.' });
    }
}

// Delete doctor (Admin only)
async function deleteDoctor(req, res) {
    const { id } = req.params;

    try {
        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
            return res.json({ message: 'Doctor deleted successfully.' });
        } else {
            const db = readLocalDb();
            db.doctors = db.doctors.filter(d => d.id !== parseInt(id, 10));
            writeLocalDb(db);
            return res.json({ message: 'Doctor deleted successfully.' });
        }
    } catch (err) {
        console.error('Error deleting doctor:', err);
        return res.status(500).json({ message: 'Failed to delete doctor.' });
    }
}

module.exports = {
    getDoctors,
    createDoctor,
    deleteDoctor
};
