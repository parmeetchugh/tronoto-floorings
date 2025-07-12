// assets/js/cart.js

const EnquiryCart = (function() {
    let items = [];
    const enquiryModal = document.getElementById('enquiryModal');
    const enquiryList = document.getElementById('enquiry-list');
    const emptyEnquiryMessage = document.getElementById('empty-enquiry-message');
    const getEstimateBtn = document.getElementById('getEstimateBtn');
    const enquiryCartIcon = document.querySelector('.enquiry-cart-icon');
    // New: Get the count span element
    const enquiryCountSpan = document.getElementById('enquiry-count');

    // Function to update the count displayed next to the icon
    function updateEnquiryCount() {
        if (enquiryCountSpan) {
            enquiryCountSpan.textContent = items.length;
            if (items.length > 0) {
                enquiryCountSpan.style.display = 'inline-block'; // Show the count badge
            } else {
                enquiryCountSpan.style.display = 'none'; // Hide if no items
            }
        }
    }

    // Function to open the enquiry modal
    function openEnquiryModal() {
        renderEnquiryList();
        enquiryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close the enquiry modal
    function closeEnquiryModal() {
        enquiryModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Function to add an item to the enquiry list
    function addItem(product) {
        // Check if the product is already in the list to avoid duplicates
        const existingItem = items.find(item => item.id === product.id);
        if (!existingItem) {
            items.push(product);
            alert(`${product.name} added to your enquiry list!`); // Simple confirmation
            updateEnquiryCount(); // Update count after adding
        } else {
            alert(`${product.name} is already in your enquiry list.`);
        }
        renderEnquiryList(); // Re-render the list after adding
    }

    // Function to remove an item from the enquiry list (optional)
    function removeItem(productId) {
        items = items.filter(item => item.id !== productId);
        updateEnquiryCount(); // Update count after removing
        renderEnquiryList();
    }

    // Function to render the enquiry list in the modal
    function renderEnquiryList() {
        enquiryList.innerHTML = ''; // Clear current list

        if (items.length === 0) {
            emptyEnquiryMessage.style.display = 'block';
            getEstimateBtn.disabled = true; // Disable estimate button if no items
            return;
        } else {
            emptyEnquiryMessage.style.display = 'none';
            getEstimateBtn.disabled = false; // Enable estimate button
        }

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash-alt"></i> Remove
                </button>
            `;
            enquiryList.appendChild(listItem);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                removeItem(productId);
            });
        });
    }

    // Function to send the estimate email
    function sendEstimateEmail() {
        if (items.length === 0) {
            alert("Your enquiry list is empty. Please add products before requesting an estimate.");
            return;
        }

        const recipientEmail = 'parmeetchugh19@gmail.com';
        const subject = encodeURIComponent('Enquiry for Stairs Products from Toronto Floorings & Building Supplies');
        let body = 'Dear Toronto Floorings & Building Supplies Team,\n\n';
        body += 'I would like to request an estimate for the following products:\n\n';

        items.forEach((item, index) => {
            body += `${index + 1}. ${item.name} (Price: $${item.price.toFixed(2)})\n`;
        });

        body += '\n\nPlease provide me with a detailed estimate for these items.\n';
        body += 'You can reach me at [Your Name] and [Your Contact Information].\n\n';
        body += 'Thank you!';

        const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink; // Open the user's email client
        closeEnquiryModal(); // Close the modal after initiating email
        items = []; // Clear the enquiry list after sending
        updateEnquiryCount(); // Update count after clearing
        renderEnquiryList(); // Update the displayed list
    }

    // Initialize event listeners for the modal
    function init() {
        // Event listener for opening the enquiry modal via the header icon
        if (enquiryCartIcon) {
            enquiryCartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                openEnquiryModal();
            });
        }

        // Event listener for closing the enquiry modal via the close button
        const closeBtn = enquiryModal.querySelector('.enquiry-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEnquiryModal);
        }

        // Event listener for closing the enquiry modal when clicking outside content
        enquiryModal.addEventListener('click', function(e) {
            if (e.target === enquiryModal) {
                closeEnquiryModal();
            }
        });

        // Event listener for the "Get Estimate" button inside the modal
        if (getEstimateBtn) {
            getEstimateBtn.addEventListener('click', sendEstimateEmail);
        }

        // Close modal on escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && enquiryModal.classList.contains('active')) {
                closeEnquiryModal();
            }
        });

        updateEnquiryCount(); // Initial update of the count on page load
        renderEnquiryList(); // Initial render of the list (will be empty)
    }

    // Public API
    return {
        init: init,
        addItem: addItem,
        removeItem: removeItem,
        getItems: () => [...items] // Return a copy of the items array
    };
})();

// Initialize the EnquiryCart when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    EnquiryCart.init();
});
