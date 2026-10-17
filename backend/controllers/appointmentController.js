const { getPool, isLocalFallback, readLocalDb, writeLocalDb } = require('../config/db');
const { sendBookingConfirmation, sendStatusUpdateEmail } = require('../services/emailService');

// Create new appointment
async function createAppointment(req, res) {
    // Accommodate flexible field names from different client versions
    const patientName = req.body.patientName || req.body.name || (req.user && req.user.name);
    const patientEmail = (req.body.patientEmail || req.body.email || (req.user && req.user.email) || '').trim().toLowerCase();
    const doctorName = req.body.doctorName || req.body.doctor || 'Dr. Specialist';
    const doctorDept = req.body.doctorDept || req.body.department || 'General Medicine';
    const doctorId = req.body.doctorId || null;
    const appointmentDate = req.body.date || req.body.appointmentDate;
    const appointmentTime = req.body.time || req.body.appointmentTime;
    const problem = req.body.problem || req.body.problemDesc || 'General Checkup';

    if (!patientName || !patientEmail || !appointmentDate || !appointmentTime) {
        return res.status(400).json({
            message: 'Patient name, email, appointment date, and time are required.'
        });
    }

    try {
        let createdAppointment = null;

        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const result = await pool.query(
                `INSERT INTO appointments 
                (patient_name, patient_email, doctor_id, doctor_name, doctor_dept, appointment_date, appointment_time, problem, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')
                RETURNING *`,
                [patientName, patientEmail, doctorId, doctorName, doctorDept, appointmentDate, appointmentTime, problem]
            );
            createdAppointment = result.rows[0];
        } else {
            const db = readLocalDb();
            createdAppointment = {
                id: (db.appointments.length ? Math.max(...db.appointments.map(a => a.id)) : 0) + 1,
                patient_name: patientName,
                patient_email: patientEmail,
                doctor_id: doctorId,
                doctor_name: doctorName,
                doctor_dept: doctorDept,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                problem,
                status: 'Pending',
                created_at: new Date().toISOString()
            };
            db.appointments.push(createdAppointment);
            writeLocalDb(db);
        }

        // Trigger email asynchronously
        sendBookingConfirmation({
            patientName,
            patientEmail,
            doctorName,
            doctorDept,
            date: appointmentDate,
            time: appointmentTime
        }).catch(err => console.error('Booking email error:', err));

        return res.status(201).json({
            message: 'Appointment booked successfully!',
            data: createdAppointment
        });
    } catch (err) {
        console.error('Error creating appointment:', err);
        return res.status(500).json({ message: 'Failed to create appointment.' });
    }
}

// Get all appointments (Admin) or user appointments (by query param)
async function getAppointments(req, res) {
    const { email } = req.query;

    try {
        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            let query = 'SELECT * FROM appointments ORDER BY id DESC';
            let params = [];

            if (email) {
                query = 'SELECT * FROM appointments WHERE LOWER(patient_email) = $1 ORDER BY id DESC';
                params = [email.trim().toLowerCase()];
            }

            const result = await pool.query(query, params);
            return res.json(result.rows);
        } else {
            const db = readLocalDb();
            let list = [...(db.appointments || [])].reverse();

            if (email) {
                list = list.filter(a => a.patient_email && a.patient_email.toLowerCase() === email.trim().toLowerCase());
            }

            return res.json(list);
        }
    } catch (err) {
        console.error('Error fetching appointments:', err);
        return res.status(500).json({ message: 'Failed to fetch appointments.' });
    }
}

// Update appointment status (Admin: Confirmed, Cancelled, Pending)
async function updateAppointmentStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        let updated = null;

        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const result = await pool.query(
                'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Appointment not found.' });
            }
            updated = result.rows[0];
        } else {
            const db = readLocalDb();
            const index = db.appointments.findIndex(a => a.id === parseInt(id, 10));
            if (index === -1) {
                return res.status(404).json({ message: 'Appointment not found.' });
            }
            db.appointments[index].status = status;
            updated = db.appointments[index];
            writeLocalDb(db);
        }

        // Notify patient of status update
        sendStatusUpdateEmail({
            patientName: updated.patient_name,
            patientEmail: updated.patient_email,
            doctorName: updated.doctor_name,
            date: updated.appointment_date,
            time: updated.appointment_time,
            newStatus: status
        }).catch(err => console.error('Status update email error:', err));

        return res.json({
            message: `Appointment ${status.toLowerCase()} successfully!`,
            data: updated
        });
    } catch (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ message: 'Failed to update appointment status.' });
    }
}

// Delete or cancel appointment
async function deleteAppointment(req, res) {
    const { id } = req.params;

    try {
        if (!isLocalFallback() && getPool()) {
            const pool = getPool();
            const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Appointment not found.' });
            }
            return res.json({ message: 'Appointment deleted successfully.' });
        } else {
            const db = readLocalDb();
            const beforeLen = db.appointments.length;
            db.appointments = db.appointments.filter(a => a.id !== parseInt(id, 10));
            if (db.appointments.length === beforeLen) {
                return res.status(404).json({ message: 'Appointment not found.' });
            }
            writeLocalDb(db);
            return res.json({ message: 'Appointment deleted successfully.' });
        }
    } catch (err) {
        console.error('Error deleting appointment:', err);
        return res.status(500).json({ message: 'Failed to delete appointment.' });
    }
}

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment
};
