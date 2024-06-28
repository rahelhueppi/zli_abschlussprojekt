/*
# author: Rahel Hüppi
# version: 1.1
# date: 27.06.2024
# description: To register. Validation for the Inputs.
*/
const form = document.forms.register;
const buttonSubmit = document.getElementById("submit");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  checkPasswords();
});

//### Function to make POST-Request
async function postData(formData) {
  // Send a POST-Request to the backend
  const response = await fetch(`/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  return response; // Return the response object for further use
}

//### Function to check, if the passwords match
async function checkPasswords() {
  let newForm = document.forms.register;
  const formData = new FormData(newForm);
  const password = formData.get("registerPassword");
  const passwordConfirmation = formData.get("registerConfirmPassword");

  // Check if both passwords are the same
  const inputConfirmation = document.getElementById("registerConfirmPassword");
  if (password !== passwordConfirmation) {
    // Passwords do not match
    inputConfirmation.setCustomValidity("Passwort stimmt nicht überein.");
    //wait for change
    document
      .querySelectorAll(
        'input[name="registerPassword"], input[name="registerConfirmPassword"]'
      )
      .forEach((input) => {
        input.addEventListener("change", () => {
          // check passwords everytime something changes
          newForm = document.forms.register;
          checkPasswords(new FormData(form));
        });
      });
  } else {
    // Passwords match
    inputConfirmation.setCustomValidity(""); // Clear validity if passwords match
    // check, if the email is avaiable
    checkEmail(formData);
  }
}

//### Function to check if the username is already in use
async function checkEmail(formData) {
  newForm = document.forms.register;
  // check, if the email is avaiable
  const response = await postData(formData);
  const email = document.getElementById("registerEmail");
  if (response.status == 409) {
    email.setCustomValidity("Benutzername ist bereits vergeben");
    // Event Listener for Changes in Email-Input-Field
    document
      .querySelector('input[name="registerEmail"]')
      .addEventListener("change", async () => {
        // Check every time the username changes
        checkPasswords();
      });
  } else {
    email.setCustomValidity("");
    window.location.href = "login.html";
  }
}
