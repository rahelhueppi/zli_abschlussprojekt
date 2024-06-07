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
  const test = {
    transactionType: "intake",
    title: "f",
    amount: "5",
    date: "2024-06-05",
    description: "f",
    category: "category1",
  };
  //postData(test);
  getDataTest();

  /*only for testing if its correct, can be deleted*/
  /*alert(`Hallo 2 ${transactionType}, ${title}, ${amount}, ${date}, ${description},
  ${category}`);*/
});

//POST-Request
async function postData(formData) {
  //host to send it to the backend
  //host = "http://localhost:3000/newTransaction.html";
  //send a POST-Request to the backend
  //`http://localhost:3001/transaction`
  const response = await fetch(`/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //body: JSON.stringify(Object.fromEntries(formData)),
    body: formData,
  });
}

//GET-Request (test) (kann gelöscht werden)
async function getDataTest() {
  let testData;

  await fetch(`/getTransactions`)
    .then((res) => res.json())
    .then((data) => (testData = data));

  alert(testData.title);
}
