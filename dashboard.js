// Doctor-Specific Dynamic Time Slots
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

// Appointment Booking Handler
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const doctor = document.getElementById('doctor-select').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;

    if (!doctor || !date || !time) return;

    const [docName, docDept] = doctor.split(' — ');

    const appointmentList = document.getElementById('appointment-list');
    const newCard = document.createElement('div');
    newCard.className = 'appointment-card fade-in';

    newCard.innerHTML = `
        <div class="doc-info">
            <h3>${docName}</h3>
            <p><i class="fa-solid fa-stethoscope"></i> ${docDept || 'General'}</p>
        </div>
        <div class="schedule-info">
            <p><i class="fa-regular fa-calendar"></i> ${date}</p>
            <p><i class="fa-regular fa-clock"></i> ${time}</p>
        </div>
        <div class="action-wrap">
            <div class="status-tag pending">Pending</div>
        </div>
    `;

    appointmentList.prepend(newCard);
    this.reset();

    Swal.fire({
        title: 'Booking Requested!',
        text: 'Your appointment is now pending admin confirmation.',
        icon: 'success',
        confirmButtonColor: '#00f2fe',
        background: '#1e1e2f',
        color: '#fff'
    });
});

// Print Printable Appointment Slip
function printSlip(doctor, dept, date, time) {
    const slipWindow = window.open('', '', 'width=600,height=600');
    slipWindow.document.write(`
        <html>
        <head>
            <title>Appointment Token - ClinicCare</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; text-align: center; }
                .token-card { border: 2px dashed #00f2fe; padding: 20px; border-radius: 12px; }
                h1 { color: #0072ff; }
                p { font-size: 16px; margin: 8px 0; }
            </style>
        </head>
        <body>
            <div class="token-card">
                <h1>🏥 ClinicCare Confirmation Slip</h1>
                <hr>
                <p><strong>Doctor:</strong> ${doctor}</p>
                <p><strong>Department:</strong> ${dept}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Status:</strong> CONFIRMED</p>
                <hr>
                <small>Please present this slip upon arrival at the clinic counter.</small>
            </div>
            <script>window.print();</script>
        </body>
        </html>
    `);
}

// Profile Picture Upload Logic
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
    const savedAvatar = localStorage.getItem('patientAvatar');
    if (savedAvatar && document.getElementById('user-avatar')) {
        document.getElementById('user-avatar').src = savedAvatar;
    }
});