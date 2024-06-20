/*
# author: Rahel Hüppi
# version: 1.0
# date: 20.06.2024
# description: For transmitting the 
# form data (new Transaction) to the backend 
*/

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
