document.addEventListener('DOMContentLoaded', function () {
    loadReservations();

    const reservationForm = document.getElementById('reservationForm');
    reservationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        try {
            validateForm();
            const formData = new FormData(reservationForm);
            const data = {
                userName: formData.get('username'),
                seatNumber: formData.get('seatNumber'),
                reservationTime: new Date().toISOString() // Dodanie daty rezerwacji
            };

            const id = reservationForm.dataset.id;
            if (id) {
                // Edycja rekordu
                updateReservation(id, data);
            } else {
                // Tworzenie nowego rekordu
                makeReservation(data);
            }
        } catch (error) {
            console.error('Validation Error:', error.message);
        }
    });

    const selectMode = document.getElementById('selectMode');
    selectMode.addEventListener('change', function () {
        const selectedMode = selectMode.value;
        if (selectedMode === 'all') {
            loadReservations();
        } else if (selectedMode === 'single') {
            const reservationId = prompt('Enter Reservation ID:');
            if (reservationId) {
                displaySingleReservation(reservationId);
            }
        }
    });
});

function validateForm() {
    const username = document.getElementById('username').value.trim();
    const seatNumber = document.getElementById('seatNumber').value.trim();
    const errorMessages = document.getElementById('errorMessages');
    errorMessages.innerHTML = '';

    if (!username || !seatNumber) {
        errorMessages.innerHTML += '<p>Username and Seat Number are required</p>';
    }

    if (!/^[a-zA-Z]+$/.test(username)) {
        errorMessages.innerHTML += '<p>Username can only contain letters</p>';
    }

    const reservationTable = document.querySelector('#reservationTable tbody');
    const existingSeats = Array.from(reservationTable.querySelectorAll('td:nth-child(3)')).map(td => td.textContent);
    if (reservationForm.dataset.id) {
        existingSeats.splice(existingSeats.indexOf(reservationForm.elements['seatNumber'].value), 1);
    }
    if (existingSeats.includes(seatNumber)) {
        errorMessages.innerHTML += '<p>Seat Number already exists</p>';
    }

    if (errorMessages.innerHTML !== '') {
        throw new Error('Validation failed');
    }
}

function loadReservations() {
    const reservationTableBody = document.querySelector('#reservationTable tbody');
    reservationTableBody.innerHTML = '';

    fetch('https://localhost:7019/api/reservation')
        .then(response => response.json())
        .then(reservations => {
            reservations.forEach(reservation => {
                const reservationDate = new Date(reservation.reservationTime);
                const formattedDate = reservationDate.toLocaleDateString('pl-PL');
                const row = `
                    <tr>
                        <td>${reservation.id}</td>
                        <td>${reservation.userName}</td>
                        <td>${reservation.seatNumber}</td>
                        <td>${formattedDate}</td>
                        <td>
                            <button onclick="editReservation(${reservation.id})">Edit</button>
                            <button onclick="deleteReservation(${reservation.id})">Delete</button>
                        </td>
                    </tr>
                `;
                reservationTableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displaySingleReservation(id) {
    const reservationTableBody = document.querySelector('#reservationTable tbody');
    reservationTableBody.innerHTML = '';

    fetch(`https://localhost:7019/api/reservation/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Reservation not found');
            }
            return response.json();
        })
        .then(reservation => {
            const reservationDate = new Date(reservation.reservationTime);
            const formattedDate = reservationDate.toLocaleDateString('pl-PL');
            const row = `
                <tr>
                    <td>${reservation.id}</td>
                    <td>${reservation.userName}</td>
                    <td>${reservation.seatNumber}</td>
                    <td>${formattedDate}</td>
                    <td>
                        <button onclick="editReservation(${reservation.id})">Edit</button>
                        <button onclick="deleteReservation(${reservation.id})">Delete</button>
                    </td>
                </tr>
            `;
            reservationTableBody.innerHTML = row;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
}

function editReservation(id) {
    const reservationForm = document.getElementById('reservationForm');
    const submitButton = reservationForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Reservation';

    fetch(`https://localhost:7019/api/reservation/${id}`)
        .then(response => response.json())
        .then(reservation => {
            reservationForm.dataset.id = id;
            reservationForm.elements['username'].value = reservation.userName;
            reservationForm.elements['seatNumber'].value = reservation.seatNumber;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateReservation(id, data) {
    fetch(`https://localhost:7019/api/reservation/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            loadReservations();
            const reservationForm = document.getElementById('reservationForm');
            reservationForm.reset();
            const submitButton = reservationForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Make Reservation';
            delete reservationForm.dataset.id;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function makeReservation(data) {
    fetch('https://localhost:7019/api/reservation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to make reservation');
            }
            loadReservations();
            const reservationForm = document.getElementById('reservationForm');
            reservationForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteReservation(id) {
    fetch(`https://localhost:7019/api/reservation/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete reservation');
            }
            loadReservations();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
