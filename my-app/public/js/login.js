/*Javascript for transmitting the login form data to backend*/

const form = document.forms.login;
let response;

//### Event-Listener on Form
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const email = formData.get("loginEmail");
  const password = formData.get("loginPassword");

  //send a POST-Request to the backend
  response = await fetch(`/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  //const responseData = await response.json();
  //const idPerson = responseData.idPerson;

  //### redirect to webapp, if logged in correctly
  if (response.status == 200) {
    alert("Logininformationen korrekt");
    window.location.href = "index.html";
  } else {
    alert("E-Mail oder Passwort falsch");
  }
});

//export { idPerson };
