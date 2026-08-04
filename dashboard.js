// 1. Logged-in User Info & Profile Picture Load
window.addEventListener('DOMContentLoaded', () => {
    // লগইন করা পেশেন্টের নাম ড্যাশবোর্ডে সেট করা
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInPatient'));
    if (loggedInUser && document.getElementById('patient-name-display')) {
        document.getElementById('patient-name-display').innerText = loggedInUser.name;
    }

    // সেভ করা প্রোফাইল পিকচার সেট করা
    const savedAvatar = localStorage.getItem('patientAvatar');
    if (savedAvatar && document.getElementById('user-avatar')) {
        document.getElementById('user-avatar').src = savedAvatar;
    }

    // পেশেন্টের নিজস্ব অ্যাপয়েন্টমেন্ট লোড করা
    loadAppointments();
});

// 2. Doctor-Specific Dynamic Time Slots
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

// 3. Load & Filter Appointments SPECIFICALLY for Logged-In User
function loadAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';
    
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInPatient'));

    if (!loggedInUser) {
        appointmentList.innerHTML = '<p style="color: #ff7675; text-align: center;">Please login first.</p>';
        return;
    }

    // সব অ্যাপয়েন্টমেন্ট থেকে শুধু এই ইমেইলের অ্যাপয়েন্টমেন্টগুলো ফিল্টার করা
    const allAppointments = JSON.parse(localStorage.getItem('clinicAppointments')) || [];
    const userAppointments = allAppointments.filter(app => app.patientEmail === loggedInUser.email);

    if (userAppointments.length === 0) {
        appointmentList.innerHTML = '<p style="color: #b2bec3; text-align: center;">No appointments booked yet.</p>';
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
                ${item.status === 'Confirmed' ? `<button class="print-btn" onclick="printSlip('${item.docName}', '${item.docDept}', '${item.date}', '${item.time}')"><i class="fa-solid fa-print"></i> Slip</button>` : ''}
            </div>
        `;
        appointmentList.appendChild(newCard);
    });
}

// 4. Submit New Appointment (Tagging with Patient Email)
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInPatient'));

    if (!loggedInUser) {
        Swal.fire({
            title: 'Error!',
            text: 'You must be logged in to book an appointment.',
            icon: 'error',
            background: '#1e1e2f',
            color: '#fff'
        });
        return;
    }

    const doctor = document.getElementById('doctor-select').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const problem = document.getElementById('problem-desc').value;

    const [docName, docDept] = doctor.split(' — ');

    // নতুন বুকিংয়ে ইউজারের ইমেইল ও নাম যুক্ত করা
    const newApp = {
        id: Date.now(),
        patientEmail: loggedInUser.email,
        patientName: loggedInUser.name,
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

// 5. Printable Slip Generator
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

// 6. Profile Avatar Change Logic
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