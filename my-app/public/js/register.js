const form = document.forms.register;

//### Event-Listener on Form
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  checkPasswords(formData);

  // Call function to make a POST-Request
  const response = await postData(formData);

  checkEmail(response);
});

//### Function to make POST-Request
async function postData(formData) {
  // Send a POST-Request to the backend
  const response = await fetch(`/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  return response; // Return the response object for further use
}

function checkPasswords(formData) {
  const password = formData.get("registerPassword");
  const passwordConfirmation = formData.get("registerConfirmPassword");

  // Check if both passwords are the same
  const inputConfirmation = document.getElementById("registerConfirmPassword");
  if (password !== passwordConfirmation) {
    inputConfirmation.setCustomValidity("Passwort stimmt nicht überein.");
  } else {
    inputConfirmation.setCustomValidity(""); // Clear validity if passwords match
  }
}

function checkEmail(response) {
  const email = document.getElementById("registerEmail");
  if (response.status == 409) {
    email.setCustomValidity("Benutzername ist bereits vergeben");
  } else {
    email.setCustomValidity("");
  }
}

// Event Listener for Changes in Password-Input-Fields
document
  .querySelectorAll(
    'input[name="registerPassword"], input[name="registerConfirmPassword"]'
  )
  .forEach((input) => {
    input.addEventListener("change", () => {
      // check passwords everytime something changes
      checkPasswords(new FormData(form));
    });
  });

// Event Listener for Changes in Email-Input-Field
document
  .querySelector('input[name="registerEmail"]')
  .addEventListener("change", async () => {
    // Create a new FormData instance and send a POST request
    const newFormData = new FormData(form);
    const response = await postData(newFormData);

    // Check the email every time it changes
    checkEmail(response);
  });
