/*Javascript for transmitting the form data to backend*/

const form = document.forms.newTransaction;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  //Data in form
  /*
  const transactionType = formData.get("transactionType");
  const title = formData.get("title");
  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");
  const category = formData.get("category");*/

  //function to make a post-request
  postData(formData);

  /*only for testing if its correct, can be deleted*/
  /*alert(`Hallo 2 ${transactionType}, ${title}, ${amount}, ${date}, ${description},
  ${category}`);*/
});

//POST-Request
async function postData(formData) {
  //host to send it to the backend
  host = "http://....";
  //send a POST-Request to the backend
  const response = await fetch(`${host}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}
