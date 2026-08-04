function loadAdminData() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';

    const appointments = JSON.parse(localStorage.getItem('clinicAppointments')) || [];

    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No appointment requests available.</td></tr>';
        updateStatsCounters();
        return;
    }

    appointments.forEach((item) => {
        const tr = document.createElement('tr');
        tr.id = `row-${item.id}`;

        tr.innerHTML = `
            <td><strong>${item.patientName}</strong></td>
            <td>${item.docName} <br><small>${item.docDept}</small></td>
            <td>${item.date} <br><small>${item.time}</small></td>
            <td>${item.problem}</td>
            <td><span class="badge ${item.status.toLowerCase()}">${item.status}</span></td>
            <td class="action-btns">
                ${item.status === 'Pending' ? `
                    <button class="btn btn-accept" onclick="updateStatus(${item.id}, 'Confirmed')"><i class="fa-solid fa-check"></i> Accept</button>
                    <button class="btn btn-reject" onclick="updateStatus(${item.id}, 'Cancelled')"><i class="fa-solid fa-xmark"></i> Reject</button>
                ` : `<span class="status-done"><i class="fa-solid fa-check-double"></i> Processed</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateStatsCounters();
}

function updateStatus(id, newStatus) {
    let appointments = JSON.parse(localStorage.getItem('clinicAppointments')) || [];

    if (newStatus === 'Cancelled') {
        Swal.fire({
            title: 'Reject Appointment?',
            text: "This patient request will be deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d63031',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Reject',
            background: '#1e1e2f',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                appointments = appointments.filter(app => app.id !== id);
                localStorage.setItem('clinicAppointments', JSON.stringify(appointments));
                loadAdminData();
            }
        });

    } else if (newStatus === 'Confirmed') {
        appointments = appointments.map(app => {
            if (app.id === id) app.status = 'Confirmed';
            return app;
        });
        localStorage.setItem('clinicAppointments', JSON.stringify(appointments));
        loadAdminData();
    }
}

function filterAppointments() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#admin-table-body tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

function updateStatsCounters() {
    const appointments = JSON.parse(localStorage.getItem('clinicAppointments')) || [];
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const confirmed = appointments.filter(a => a.status === 'Confirmed').length;

    if (document.getElementById('total-count')) document.getElementById('total-count').innerText = total;
    if (document.getElementById('pending-count')) document.getElementById('pending-count').innerText = pending;
    if (document.getElementById('confirmed-count')) document.getElementById('confirmed-count').innerText = confirmed;
}

window.addEventListener('DOMContentLoaded', loadAdminData);