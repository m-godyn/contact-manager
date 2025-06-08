document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const editModal = new bootstrap.Modal(document.getElementById('editContactModal'));
    const editForm = document.getElementById('editContactForm');
    const saveButton = document.getElementById('saveContactBtn');
    const alertBox = document.getElementById('editAlertBox');
    let currentContactId = null;

    function showAlert(message, type = 'danger') {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove('d-none');
    }

    function hideAlert() {
        alertBox.classList.add('d-none');
    }

    // Handle delete confirmation
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const confirmMessage = button.dataset.confirm;
            if (confirm(confirmMessage)) {
                window.location.href = button.href;
            }
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const contactId = button.dataset.id;
            try {
                const response = await fetch(`/admin/edit/${contactId}`);
                const contact = await response.json();
                
                if (response.ok) {
                    currentContactId = contactId;
                    editForm.name.value = contact.name;
                    editForm.email.value = contact.email;
                    hideAlert();
                    editModal.show();
                } else {
                    showAlert(contact.error || 'Error loading contact data');
                }
            } catch (error) {
                showAlert('Error loading contact data');
            }
        });
    });

    saveButton.addEventListener('click', async () => {
        const formData = new FormData(editForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email')
        };

        try {
            const response = await fetch(`/admin/edit/${currentContactId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                window.location.reload();
            } else {
                showAlert(result.message);
            }
        } catch (error) {
            showAlert('An unexpected error occurred. Please try again.');
        }
    });

    // Hide alert when modal is closed
    document.getElementById('editContactModal').addEventListener('hidden.bs.modal', hideAlert);
});