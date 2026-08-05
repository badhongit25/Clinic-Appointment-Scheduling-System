// আপনার নতুন Render Backend URL
const API_BASE_URL = "https://clinic-appointment-backend-qg0f.onrender.com";
// Load Appointments from MongoDB Server
async function loadAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    if (!appointmentList) return;
    
    appointmentList.innerHTML = '';

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInPatient'));
    if (!loggedInUser) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/appointments`);
        const allAppointments = await res.json();

        // শুধু এই লগইন করা ইউজারের ইমেইলের অ্যাপয়েন্টমেন্ট ফিল্টার করা
        const userAppointments = allAppointments.filter(app => app.patientEmail === loggedInUser.email);

        if (userAppointments.length === 0) {
            appointmentList.innerHTML = '<p style="color: #b2bec3; text-align: center;">No appointments found.</p>';
            return;
        }

        userAppointments.forEach((item) => {
            const newCard = document.createElement('div');
            newCard.className = 'appointment-card fade-in';
            newCard.innerHTML = `
                <div class="doc-info">
                    <h3>${item.docName}</h3>
                    <p><i class="fa-solid fa-stethoscope"></i> ${item.docDept}</p>
                </div>
                <div class="schedule-info">
                    <p><i class="fa-regular fa-calendar"></i> ${item.date}</p>
                    <p><i class="fa-regular fa-clock"></i> ${item.time}</p>
                </div>
                <div class="action-wrap">
                    <div class="status-tag ${item.status.toLowerCase()}">${item.status}</div>
                </div>
            `;
            appointmentList.appendChild(newCard);
        });
    } catch (err) {
        console.error('Error fetching appointments:', err);
    }
}

// Submit New Appointment to Database
document.getElementById('appointment-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInPatient'));
    if (!loggedInUser) return;

    const doctor = document.getElementById('doctor-select').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const problem = document.getElementById('problem-desc').value;
    const [docName, docDept] = doctor.split(' — ');

    const newApp = {
        patientEmail: loggedInUser.email,
        patientName: loggedInUser.name,
        docName,
        docDept: docDept || 'General',
        date,
        time,
        problem
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newApp)
        });

        if (res.ok) {
            this.reset();
            loadAppointments();
            Swal.fire({ title: 'Success!', text: 'Appointment booked in Database.', icon: 'success', background: '#1e1e2f', color: '#fff' });
        }
    } catch (err) {
        Swal.fire({ title: 'Error!', text: 'Failed to save appointment.', icon: 'error', background: '#1e1e2f', color: '#fff' });
    }
});

window.addEventListener('DOMContentLoaded', loadAppointments);