function updateStatus(rowId, newStatus) {
    const row = document.getElementById(rowId);
    if (!row) return;

    if (newStatus === 'Cancelled') {
        Swal.fire({
            title: 'Reject Appointment?',
            text: "This patient request will be deleted permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d63031',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Reject',
            background: '#1e1e2f',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                row.style.transition = 'all 0.5s ease';
                row.style.opacity = '0';
                row.style.transform = 'translateX(50px)';
                
                setTimeout(() => {
                    row.remove();
                    updateStatsCounters();
                }, 500);

                Swal.fire({
                    title: 'Rejected!',
                    text: 'Appointment has been removed.',
                    icon: 'success',
                    timer: 1200,
                    showConfirmButton: false,
                    background: '#1e1e2f',
                    color: '#fff'
                });
            }
        });

    } else if (newStatus === 'Confirmed') {
        const statusCell = row.children[4];
        const actionCell = row.children[5];

        statusCell.innerHTML = `<span class="badge confirmed">Confirmed</span>`;
        actionCell.innerHTML = `<span class="status-done"><i class="fa-solid fa-check-double"></i> Processed</span>`;
        
        updateStatsCounters();

        Swal.fire({
            title: 'Confirmed!',
            text: 'Patient appointment approved.',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            background: '#1e1e2f',
            color: '#fff'
        });
    }
}

// Live Search Filter
function filterAppointments() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#admin-table-body tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}

function updateStatsCounters() {
    const totalRows = document.querySelectorAll('#admin-table-body tr').length;
    const pendingBadges = document.querySelectorAll('.badge.pending').length;
    const confirmedBadges = document.querySelectorAll('.badge.confirmed').length;

    if (document.getElementById('total-count')) document.getElementById('total-count').innerText = totalRows;
    if (document.getElementById('pending-count')) document.getElementById('pending-count').innerText = pendingBadges;
    if (document.getElementById('confirmed-count')) document.getElementById('confirmed-count').innerText = confirmedBadges;
}