// Time Slot Filter
function updateTimeSlots() {
    const docSelect = document.getElementById('doctor-select').value;
    const timeSelect = document.getElementById('appointment-time');
    
    timeSelect.innerHTML = '<option value="" disabled selected>Select available slot...</option>';

    let slots = [];
    if (docSelect.includes('Sarah Khan')) {
        slots = ['10:00 AM', '11:30 AM', '02:00 PM'];
    } else if (docSelect.includes('Tanvir Ahmed')) {
        slots = ['04:00 PM', '05:30 PM', '07:00 PM'];
    } else if (docSelect.includes('Nusrat Jahan')) {
        slots = ['09:00 AM', '11:00 AM', '03:00 PM'];
    } else {
        slots = ['10:00 AM', '01:00 PM', '06:00 PM'];
    }

    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
    });
}

// Save & Render Appointments from LocalStorage
function loadAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';
    
    const appointments = JSON.parse(localStorage.getItem('clinicAppointments')) || [];

    if (appointments.length === 0) {
        appointmentList.innerHTML = '<p style="color: #b2bec3; text-align: center;">No appointments booked yet.</p>';
        return;
    }

    appointments.forEach((item) => {
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
                ${item.status === 'Confirmed' ? `<button class="print-btn" onclick="printSlip('${item.docName}', '${item.docDept}', '${item.date}', '${item.time}')"><i class="fa-solid fa-print"></i> Slip</button>` : ''}
            </div>
        `;
        appointmentList.appendChild(newCard);
    });
}

// Submit New Appointment
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const doctor = document.getElementById('doctor-select').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const problem = document.getElementById('problem-desc').value;

    const [docName, docDept] = doctor.split(' — ');

    const newApp = {
        id: Date.now(),
        patientName: "Patient User",
        docName,
        docDept: docDept || 'General',
        date,
        time,
        problem,
        status: 'Pending'
    };

    const appointments = JSON.parse(localStorage.getItem('clinicAppointments')) || [];
    appointments.unshift(newApp);
    localStorage.setItem('clinicAppointments', JSON.stringify(appointments));

    this.reset();
    loadAppointments();

    Swal.fire({
        title: 'Booking Requested!',
        text: 'Your appointment request has been saved.',
        icon: 'success',
        confirmButtonColor: '#00f2fe',
        background: '#1e1e2f',
        color: '#fff'
    });
});

// Print Slip
function printSlip(doctor, dept, date, time) {
    const slipWindow = window.open('', '', 'width=600,height=600');
    slipWindow.document.write(`
        <html>
        <head>
            <title>Appointment Slip - ClinicCare</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; text-align: center; }
                .token-card { border: 2px dashed #00f2fe; padding: 20px; border-radius: 12px; }
                h1 { color: #0072ff; }
            </style>
        </head>
        <body>
            <div class="token-card">
                <h1>🏥 ClinicCare Slip</h1>
                <hr>
                <p><strong>Doctor:</strong> ${doctor}</p>
                <p><strong>Dept:</strong> ${dept}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
}

// Avatar upload logic
const avatarInput = document.getElementById('avatar-input');
if (avatarInput) {
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('user-avatar').src = event.target.result;
                localStorage.setItem('patientAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadAppointments();
    const savedAvatar = localStorage.getItem('patientAvatar');
    if (savedAvatar && document.getElementById('user-avatar')) {
        document.getElementById('user-avatar').src = savedAvatar;
    }
});