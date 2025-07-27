// assets/js/cart.js

const EnquiryCart = (function() {
    let items = [];
    const enquiryModal = document.getElementById('enquiryModal');
    const enquiryList = document.getElementById('enquiry-list');
    const emptyEnquiryMessage = document.getElementById('empty-enquiry-message');
    const getEstimateBtn = document.getElementById('getEstimateBtn');
    // const enquiryCartIcon = document.querySelector('.enquiry-cart-icon'); // No longer needed if using delegated event on document.body
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
        if (enquiryModal) {
            enquiryModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    // Function to close the enquiry modal
    function closeEnquiryModal() {
        if (enquiryModal) {
            enquiryModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
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

    // Function to remove an item from the enquiry list
    function removeItem(productId) {
        items = items.filter(item => item.id !== productId);
        updateEnquiryCount(); // Update count after removing
        renderEnquiryList();
    }

    // Function to render the enquiry list in the modal
    function renderEnquiryList() {
        if (!enquiryList) return; // Ensure enquiryList element exists

        enquiryList.innerHTML = ''; // Clear current list
        if (items.length === 0) {
            if (emptyEnquiryMessage) emptyEnquiryMessage.style.display = 'block';
            if (getEstimateBtn) getEstimateBtn.disabled = true; // Disable estimate button if no items
            return;
        } else {
            if (emptyEnquiryMessage) emptyEnquiryMessage.style.display = 'none';
            if (getEstimateBtn) getEstimateBtn.disabled = false; // Enable
        }

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-enquiry" data-id="${item.id}">&times;</button>
            `;
            enquiryList.appendChild(listItem);
        });
    }

    // Function to send estimate email (placeholder)
    function sendEstimateEmail() {
        if (items.length === 0) {
            alert("Your enquiry list is empty. Please add items before requesting an estimate.");
            return;
        }
        const enquiryDetails = items.map(item => `${item.name} ($${item.price.toFixed(2)})`).join('\n');
        const emailBody = `Enquiry Details:\n\n${enquiryDetails}\n\nPlease provide an estimate for these items.`;
        // In a real application, you would send this to a backend service.
        // For demonstration, we'll use mailto:
        window.location.href = `mailto:info@yourcompany.com?subject=Enquiry%20Estimate%20Request&body=${encodeURIComponent(emailBody)}`;
        alert("Estimate request sent (simulated). Please check your email client.");
        // Clear the enquiry list after sending
        items = [];
        updateEnquiryCount();
        renderEnquiryList();
        closeEnquiryModal();
    }

    function init() {
        // Event listener for opening the enquiry modal via the cart icon
        // Using event delegation on document.body to catch clicks on dynamically added/replaced elements
        document.body.addEventListener('click', function(e) {
            if (e.target.closest('.enquiry-cart-icon')) {
                openEnquiryModal();
                e.preventDefault(); // Prevent default link behavior if href="#"
            }
        });

        // Event listener for remove buttons inside the modal
        // Using event delegation on enquiryList to handle dynamically added list items
        if (enquiryList) {
            enquiryList.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-from-enquiry')) {
                    const productIdToRemove = parseInt(e.target.dataset.id);
                    removeItem(productIdToRemove);
                }
            });
        }

        // Event listener for closing the enquiry modal via the close button
        const closeBtn = enquiryModal ? enquiryModal.querySelector('.enquiry-modal-close') : null;
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEnquiryModal);
        }

        // Event listener for closing the enquiry modal when clicking outside content
        if (enquiryModal) {
            enquiryModal.addEventListener('click', function(e) {
                if (e.target === enquiryModal) {
                    closeEnquiryModal();
                }
            });
        }

        // Event listener for the "Get Estimate" button inside the modal
        if (getEstimateBtn) {
            getEstimateBtn.addEventListener('click', sendEstimateEmail);
        }

        // Close modal on escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && enquiryModal && enquiryModal.classList.contains('active')) {
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
        getItems: () => [...items], // Return a copy of the items array
        updateEnquiryCount: updateEnquiryCount, // Expose update function for external use
        renderEnquiryList: renderEnquiryList // Expose render function for external use
    };
})();

// Initialize the EnquiryCart when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    EnquiryCart.init();
});