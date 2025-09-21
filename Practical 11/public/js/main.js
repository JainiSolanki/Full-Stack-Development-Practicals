// Basic JavaScript for the template
document.addEventListener("DOMContentLoaded", function () {
  console.log("Express Template loaded successfully!");

  // Add current timestamp to page
  updateTimestamp();

  // Update timestamp every minute
  setInterval(updateTimestamp, 60000);

  // Add click handlers for interactive elements
  addClickHandlers();
});

function updateTimestamp() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();

  // Update time display if element exists
  const timeElements = document.querySelectorAll(".info-item");
  timeElements.forEach((element) => {
    if (element.innerHTML.includes("Time:")) {
      element.innerHTML = `<strong>Time:</strong> ${timeString}`;
    }
  });
}

function addClickHandlers() {
  // Add smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Log API calls (example)
  console.log("API Status endpoint: /api/status");
}

// Utility function for future use
function makeAPICall(endpoint) {
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      return data;
    })
    .catch((error) => {
      console.error("API Error:", error);
    });
}
