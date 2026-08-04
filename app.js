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

// 3. Admin Login Handler
function handleAdminLogin(event) {
    event.preventDefault();
    
    Swal.fire({
        title: 'Admin Access Granted!',
        text: 'Opening Admin Management Panel...',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        background: '#1e1e2f',
        color: '#fff'
    }).then(() => {
        window.location.href = "admin.html";
    });
}