const form = document.querySelector("form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("contact-email");
const phoneInput = document.getElementById("contact-phone");
const messageInput = document.getElementById("contact-message");
const submitButton = document.querySelector('button[type="submit"]');

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  let errorElement = field.parentElement.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.className =
      "error-message font-lato text-accent text-[12px] lg:text-[14px] mt-1";
    field.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function hideError(fieldId) {
  const field = document.querySelector(`#${fieldId}`);
  if (field && field.parentElement) {
    const errorElement = field.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.classList.add("hidden");
      errorElement.textContent = "";
    }
  }
}

function hideAllErrors() {
  const fieldIds = [
    "first-name",
    "last-name",
    "contact-email",
    "contact-phone",
    "contact-message",
  ];
  fieldIds.forEach(hideError);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm() {
  hideAllErrors();
  let isValid = true;

  const firstName = firstNameInput.value.trim();
  if (!firstName) {
    showError("first-name", "First name is required");
    isValid = false;
  }

  const lastName = lastNameInput.value.trim();
  if (!lastName) {
    showError("last-name", "Last name is required");
    isValid = false;
  }

  const email = emailInput.value.trim();
  if (!email) {
    showError("contact-email", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("contact-email", "Please enter a valid email address");
    isValid = false;
  }

  const phone = phoneInput.value.trim();
  if (phone && phone.length > 0) {
    const phoneRegex = /^[0-9\s\-+()]+$/;
    if (!phoneRegex.test(phone)) {
      showError("contact-phone", "Please enter a valid phone number");
      isValid = false;
    }
  }

  const message = messageInput.value.trim();
  if (!message) {
    showError("contact-message", "Message is required");
    isValid = false;
  } else if (message.length > 500) {
    showError(
      "contact-message",
      "Message cannot be greater than 500 characters"
    );
    isValid = false;
  }

  return isValid;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAllErrors();

    if (!validateForm()) {
      return;
    }

    submitButton.disabled = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.scrollTo({ top: 0, behavior: "smooth" });

      const successMessage = document.createElement("div");
      successMessage.className =
        "font-lato text-accent text-[14px] lg:text-[16px] mt-4 p-4 text-center";
      successMessage.textContent = "Message sent successfully!";
      form.appendChild(successMessage);

      form.reset();

      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    } catch (error) {
      console.error("Failed to send message:", error);
      showError("contact-message", "Failed to send message. Please try again.");
    } finally {
      submitButton.disabled = false;
    }
  });
}
