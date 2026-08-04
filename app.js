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

// 1. Patient Registration Handler (LocalStorage e save korar jonno)
function handlePatientRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    // LocalStorage theke ager registered patients niye asha
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];

    // Check kora ei email shobai age register korse kina
    const isExist = registeredPatients.some(patient => patient.email === email);

    if (isExist) {
        Swal.fire({
            title: 'Email Already Exists!',
            text: 'This email is already registered. Please login.',
            icon: 'warning',
            background: '#1e1e2f',
            color: '#fff'
        });
        return;
    }

    // Nutun patient add kora
    registeredPatients.push({ name, email, password });
    localStorage.setItem('registeredPatients', JSON.stringify(registeredPatients));

    Swal.fire({
        title: 'Registration Successful!',
        text: 'Your account has been created. Please login now.',
        icon: 'success',
        confirmButtonColor: '#00c6ff',
        background: '#1e1e2f',
        color: '#fff'
    }).then(() => {
        switchForm('patient-login');
    });
}

// 2. Patient Login Handler (Validation add kora hoese)
function handlePatientLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];

    // Registered Patients der vitor match kora
    const validPatient = registeredPatients.find(patient => patient.email === email && patient.password === password);

    if (validPatient) {
        // Patient er name o details store rakha Dashboard e dekhanor jonno
        localStorage.setItem('loggedInPatient', JSON.stringify(validPatient));

        Swal.fire({
            title: 'Login Successful!',
            text: `Welcome back, ${validPatient.name}!`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#1e1e2f',
            color: '#fff'
        }).then(() => {
            window.location.href = "dashboard.html";
        });
    } else {
        // Register na thakle ba vool password dile error ashbe
        Swal.fire({
            title: 'Access Denied!',
            text: 'Invalid Email or Password! Please register first if you are new.',
            icon: 'error',
            confirmButtonColor: '#ff7675',
            background: '#1e1e2f',
            color: '#fff'
        });
    }
}

// Strict Patient Login Handler
function handlePatientLogin(event) {
    event.preventDefault();

    // ইনপুট ভ্যালু নেওয়া এবং স্পেস ট্রিম (Trim) করা
    const emailInput = document.getElementById('login-email').value.trim();
    const passwordInput = document.getElementById('login-password').value.trim();

    // LocalStorage থেকে রেজিস্টার্ড পেশেন্টদের লিস্ট আনা
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];

    // রেজিস্টার্ড ইউজারদের সাথে একদম হুবহু মেলানো (Strict Check)
    const validPatient = registeredPatients.find(patient => 
        patient.email.toLowerCase() === emailInput.toLowerCase() && patient.password === passwordInput
    );

    if (validPatient) {
        // সঠিক ইউজার হলে ডাটা সেভ করে ড্যাশবোর্ডে পাঠাবে
        localStorage.setItem('loggedInPatient', JSON.stringify(validPatient));

        Swal.fire({
            title: 'Login Successful!',
            text: `Welcome back, ${validPatient.name}!`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#1e1e2f',
            color: '#fff'
        }).then(() => {
            window.location.href = "dashboard.html";
        });
    } else {
        // রেজিস্টার না করা উল্টাপাল্টা ইমেইল বা ভুল পাসওয়ার্ড দিলে আটকে দেবে
        Swal.fire({
            title: 'Access Denied!',
            text: 'No account found with this email or password! Please Register first.',
            icon: 'error',
            confirmButtonColor: '#ff7675',
            background: '#1e1e2f',
            color: '#fff'
        });
    }
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