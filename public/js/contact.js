document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const alertBox = document.getElementById('alert-box');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        try {
            const res = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ name, email }),
            });

            const data = await res.json();

            if (data.success === true) {
                alertBox.className = 'alert alert-success';
                alertBox.textContent = data.message;
                alertBox.classList.remove('d-none');
                form.reset();
            } else {
                alertBox.className = 'alert alert-danger';
                alertBox.textContent = data.message || 'An error occurred';
                alertBox.classList.remove('d-none');
            }
        } catch (error) {
            alertBox.className = 'alert alert-danger';
            alertBox.textContent = 'An error occurred while submitting the form';
            alertBox.classList.remove('d-none');
        }
    });
});