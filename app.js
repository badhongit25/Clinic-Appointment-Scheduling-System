// Render Backend Server URL
const API_BASE_URL = "https://clinic-appointment-backend-qg0f.onrender.com";

// 1. Switch Between Login / Register Forms
function switchForm(formId) {
    const forms = document.querySelectorAll('.form-section');
    forms.forEach(form => {
        form.classList.remove('active');
        form.classList.add('hidden');
    });

    const activeForm = document.getElementById(formId);
    if (activeForm) {
        activeForm.classList.remove('hidden');
        activeForm.classList.add('active');
    }
}

// 2. Toggle Password Visibility
function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// 3. Theme Toggle Switcher
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (document.body.classList.contains('light-theme')) {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

// 4. Patient Register Handler
async function handlePatientRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'patient' })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Registration Successful!',
                text: 'Your account is created. Please login.',
                icon: 'success',
                background: '#1e1e2f',
                color: '#fff'
            }).then(() => switchForm('patient-login'));
        } else {
            Swal.fire({ title: 'Error!', text: data.message || 'Registration failed', icon: 'error', background: '#1e1e2f', color: '#fff' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error!', text: 'Could not connect to database.', icon: 'error', background: '#1e1e2f', color: '#fff' });
    }
}

// 5. Patient Login Handler
async function handlePatientLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('loggedInPatient', JSON.stringify(data.user));

            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome back, ${data.user.name}!`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e1e2f',
                color: '#fff'
            }).then(() => window.location.href = "dashboard.html");
        } else {
            Swal.fire({ title: 'Access Denied!', text: data.message || 'Invalid Credentials', icon: 'error', background: '#1e1e2f', color: '#fff' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error!', text: 'Could not connect to server.', icon: 'error', background: '#1e1e2f', color: '#fff' });
    }
}

// 6. Admin Login Handler
async function handleAdminLogin(event) {
    event.preventDefault();
    const adminId = document.getElementById('admin-id').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminId, password, role: 'admin' })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('loggedInAdmin', JSON.stringify(data.user));
            Swal.fire({
                title: 'Admin Access Granted!',
                text: 'Welcome Admin',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1e1e2f',
                color: '#fff'
            }).then(() => window.location.href = "admin-dashboard.html");
        } else {
            Swal.fire({ title: 'Access Denied!', text: data.message || 'Invalid Admin Credentials', icon: 'error', background: '#1e1e2f', color: '#fff' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error!', text: 'Could not connect to server.', icon: 'error', background: '#1e1e2f', color: '#fff' });
    }
}

// 7. Delete/Cancel Appointment Function
async function deleteAppointment(id) {
    const confirmDelete = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to cancel this appointment?",
        icon: 'warning',
        showCancelButton: true,
        confirmColor: '#d33',
        cancelColor: '#3085d6',
        confirmButtonText: 'Yes, Cancel it!',
        background: '#1e1e2f',
        color: '#fff'
    });

    if (confirmDelete.isConfirmed) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your appointment has been removed.',
                    icon: 'success',
                    background: '#1e1e2f',
                    color: '#fff'
                });
                // ডা্যাশবোর্ডের অ্যাপয়েন্টমেন্ট লিস্ট রিফ্রেশ করা
                if (typeof loadAppointments === 'function') {
                    loadAppointments(); 
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to cancel appointment',
                    icon: 'error',
                    background: '#1e1e2f',
                    color: '#fff'
                });
            }
        } catch (err) {
            console.error("Delete Error:", err);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong while connecting to the server',
                icon: 'error',
                background: '#1e1e2f',
                color: '#fff'
            });
        }
    }
}