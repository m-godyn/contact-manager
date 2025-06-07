document.addEventListener('DOMContentLoaded', function () {
    const editModal = new bootstrap.Modal(document.getElementById('editContactModal'));
    const editForm = document.getElementById('editContactForm');
    const saveBtn = document.getElementById('saveContactBtn');
    let currentContactId = null;

    // Handle edit button clicks
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const contactId = this.dataset.id;
            currentContactId = contactId;

            try {
                const response = await fetch(`/admin/edit/${contactId}`);
                const contact = await response.json();

                // Fill the form with contact data
                editForm.name.value = contact.name;
                editForm.email.value = contact.email;

                // Show the modal
                editModal.show();
            } catch (error) {
                console.error('Error loading contact:', error);
                alert('Error loading contact data');
            }
        });
    });

    // Handle save button click
    saveBtn.addEventListener('click', async function () {
        if (!editForm.checkValidity()) {
            editForm.reportValidity();
            return;
        }

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

            if (result.success) {
                // Reload the page to show updated data
                window.location.reload();
            } else {
                alert('Error updating contact');
            }
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('Error saving contact');
        }
    });
});