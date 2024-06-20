/*Javascript for transmitting the form data to backend (from newTransaction.html)*/

const form = document.forms.newTransaction;

//### Event-Listener on Form
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  //call function to make a post-request
  postData(formData);
});

//### Function to make POST-Request
async function postData(formData) {
  //send a POST-Request to the backend
  //`http://localhost:3001/transaction`
  const response = await fetch(`/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}
