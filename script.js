document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("registerForm");
  const messageDiv = document.getElementById("message");
  
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload
    
    // Get form values
    const fullName = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const learningType = document.getElementById("learning-type").value;
    const experience = document.getElementById("experience").value;
    const tools = document.getElementById("tools").value;
    const goal = document.getElementById("goal").value;
    
    // Validate form (basic check)
    if (fullName === "" || email === "" || phone === "" || learningType === "" || experience === "" || goal === "") {
      messageDiv.textContent = "Please fill in all required fields.";
      messageDiv.style.color = "red";
      messageDiv.classList.remove("hidden");
      return;
    }
    
    // Display success message
    messageDiv.textContent = `Thank you, ${fullName}! Redirecting to final registration...`;
    messageDiv.style.color = "green";
    messageDiv.classList.remove("hidden");
    
    // Wait for a few seconds before redirecting
    setTimeout(() => {
      window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSeeD6XzPvehZvik-IAyIWdLOqavXt9bj058BNFQrgh1ZQcQ8Q/viewform?usp=sf_link";
    }, 2000); // Redirect after 2 seconds
    
    // Clear the form (optional)
    form.reset();
  });
});