/*Javascript for transmitting the register form data to backend*/

const form = document.forms.register;

//### Event-Listener on Form
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const password = formData.get("registerPassword");
  const passwordConfirmation = formData.get("registerConfirmPassword");

  // check, if both passwords are the same
  const inputConfirmation = document.getElementById("registerConfirmPassword");
  if (password !== passwordConfirmation) {
    inputConfirmation.setCustomValidity("Passwort stimmt nicht überein.");
  } else {
    inputConfirmation.setCustomValidity("");
  }

  //call function to make a post-request
  postData(formData);
});

//### Function to make POST-Request
async function postData(formData) {
  //send a POST-Request to the backend
  const response = await fetch(`/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}
