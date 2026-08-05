// Render Backend Server URL
// আপনার নতুন Render Backend URL
const API_BASE_URL = "https://clinic-appointment-backend-qg0f.onrender.com";

// 1. Patient Register Handler
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
            Swal.fire({ title: 'Error!', text: data.message, icon: 'error', background: '#1e1e2f', color: '#fff' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error!', text: 'Could not connect to database.', icon: 'error', background: '#1e1e2f', color: '#fff' });
    }
}

// 2. Patient Login Handler
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
            Swal.fire({ title: 'Access Denied!', text: data.message, icon: 'error', background: '#1e1e2f', color: '#fff' });
        }
    } catch (err) {
        Swal.fire({ title: 'Server Error!', text: 'Could not connect to server.', icon: 'error', background: '#1e1e2f', color: '#fff' });
    }
}