// Form Switching Logic
function switchForm(formId) {
    const forms = document.querySelectorAll('.form-section');
    
    forms.forEach(form => {
        form.classList.remove('active');
        form.classList.add('hidden');
    });

    setTimeout(() => {
        const activeForm = document.getElementById(formId);
        activeForm.classList.remove('hidden');
        activeForm.classList.add('active');
    }, 100);
}

// Password Eye Toggle Logic
function togglePasswordVisibility(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Light / Dark Theme Toggle Logic
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const icon = document.querySelector('#theme-toggle-btn i');
    
    if(document.body.classList.contains('light-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// 1. Patient Registration Handler
async function handlePatientRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    Swal.fire({
        title: 'Registration Successful!',
        text: 'Welcome aboard! Please login now.',
        icon: 'success',
        confirmButtonColor: '#00c6ff',
        background: '#1e1e2f',
        color: '#fff'
    }).then(() => {
        switchForm('patient-login');
    });
}

// 2. Patient Login Handler
async function handlePatientLogin(event) {
    event.preventDefault();

    Swal.fire({
        title: 'Login Successful!',
        text: 'Redirecting to your patient dashboard...',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#1e1e2f',
        color: '#fff'
    }).then(() => {
        window.location.href = "dashboard.html";
    });
}

// Admin Registration Handler
function handleAdminRegister(event) {
    event.preventDefault();

    const adminId = document.getElementById('reg-admin-id').value;
    const adminPassword = document.getElementById('reg-admin-password').value;

    // অ্যাডমিন ডাটা LocalStorage এ সেভ রাখা
    const registeredAdmins = JSON.parse(localStorage.getItem('registeredAdmins')) || [];

    // চেক করা এই ID অলরেডি আছে কিনা
    const exists = registeredAdmins.some(admin => admin.id === adminId);

    if (exists) {
        Swal.fire({
            title: 'Already Exists!',
            text: 'This Admin ID is already registered.',
            icon: 'warning',
            background: '#1e1e2f',
            color: '#fff'
        });
        return;
    }

    registeredAdmins.push({ id: adminId, password: adminPassword });
    localStorage.setItem('registeredAdmins', JSON.stringify(registeredAdmins));

    Swal.fire({
        title: 'Admin Registered!',
        text: 'Account created successfully. Please login now.',
        icon: 'success',
        confirmButtonColor: '#00c6ff',
        background: '#1e1e2f',
        color: '#fff'
    }).then(() => {
        switchForm('admin-login');
    });
}

// Admin Login Handler
function handleAdminLogin(event) {
    event.preventDefault();

    const adminId = document.getElementById('admin-id').value;
    const adminPassword = document.getElementById('admin-password').value;

    const registeredAdmins = JSON.parse(localStorage.getItem('registeredAdmins')) || [];

    // LocalStorage এর ডাটার সাথে মিলিয়ে দেখা
    const validAdmin = registeredAdmins.find(admin => admin.id === adminId && admin.password === adminPassword);

    if (validAdmin) {
        Swal.fire({
            title: 'Admin Access Granted!',
            text: 'Welcome to Admin Management Panel.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#1e1e2f',
            color: '#fff'
        }).then(() => {
            window.location.href = "admin.html";
        });
    } else {
        Swal.fire({
            title: 'Access Denied!',
            text: 'Invalid Admin ID or Password. Please register first if you are new.',
            icon: 'error',
            confirmButtonColor: '#ff7675',
            background: '#1e1e2f',
            color: '#fff'
        });
    }
}