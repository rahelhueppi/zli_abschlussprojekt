/*
# author: Rahel Hüppi
# version: 1.0
# date: 20.06.2024
# description: For transmitting the 
login form data to backend
*/

const form = document.forms.login;
let response;

//### Event-Listener on Form
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  //send a POST-Request to the backend
  response = await fetch(`/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  //### redirect to webapp, if logged in correctly
  if (response.status == 200) {
    alert("Logininformationen korrekt");
    window.location.href = "index.html";
  } else {
    alert("E-Mail oder Passwort falsch");
  }
});
