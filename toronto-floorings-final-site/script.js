// Function to toggle the navigation menu for mobile responsiveness
function toggleMenu() {
  const nav = document.getElementById('navMenu');
  nav.classList.toggle('show');
}

// Global function to handle the "Shop Now" / "Explore Our Products" / "Browse All Products" button click
// This function will be present in index.html, shop.html, etc.
function handleShopClick() {
  const messageDivId = 'shopMessage';
  let messageDiv = document.getElementById(messageDivId);

  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = messageDivId;
    messageDiv.className = 'shop-message';
    document.body.appendChild(messageDiv);
  }

  messageDiv.textContent = 'Redirecting to our Shop page (products and brands coming soon)!';
  messageDiv.style.opacity = '0'; // Start invisible for transition
  messageDiv.style.display = 'flex'; // Ensure it's displayed for animation

  // Animate the message in
  setTimeout(() => {
    messageDiv.style.opacity = '1';
  }, 10);

  // Animate the message out and remove after a few seconds
  setTimeout(() => {
    messageDiv.style.opacity = '0';
    messageDiv.addEventListener('transitionend', () => {
      messageDiv.style.display = 'none'; // Hide after transition
      messageDiv.remove(); // Remove from DOM
    }, { once: true }); // Ensure listener is removed after one use
  }, 3000);
}
