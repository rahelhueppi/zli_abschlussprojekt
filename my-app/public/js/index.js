/*
# author: Rahel Hüppi
# version: 1.0
# date: 26.06.2024
# description: Requests for index.html
# verify, get number of transactions, get balance
*/

// If you're logged in, you stay on index.html
// or else you will be redirected to login.html

fetch(`/auth/verify`, {
  method: "GET",
})
  .then((response) => {
    /*alert(response.status);*/
    if (response.status == 401) {
      window.location.href = "login.html";
    } else if (response.status == 200 || response.status == 304) {
      //send other requests when user is logged in
      getNumberTransactions();
      getBalance();
    } else {
      alert(response.status);
    }
    return response.text(); //get body as string
  })
  .then((body) => {
    //convert string in JSON-object
    const data = JSON.parse(body);

    //fill the hello-message with the username
    const helloMessage = document.getElementById("helloMessage");
    helloMessage.innerHTML = `Hallo ${data.email}`;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

//### get the number of Transactions of a person
function getNumberTransactions() {
  fetch(`/dashboard/numberTransactions`, {
    method: "GET",
  })
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      const data = JSON.parse(body);

      const numberOfTransactions = document.getElementById(
        "numberOfTransactions"
      );
      numberOfTransactions.innerText = `Bisher haben Sie ${data[0].numberTransactions} Transaktionen durchgeführt.`;
    });
}
//### get the saldo of a person
function getBalance() {
  fetch(`/dashboard/balance`, {
    method: "GET",
  })
    .then((response) => {
      // Use.json() to parse the response body as JSON
      return response.json();
    })
    .then((data) => {
      // data contains parsed json
      let balance = 0;
      if (data.length > 0) {
        // create an article-element for every transaction
        for (const i in data) {
          // if it's an exprense the amount gets multiplied with -1
          let amount = data[i].amount;
          if (data[i].transactionType == "expense") {
            amount = amount * -1;
          }
          // update amount
          console.log(amount);
          balance += amount;
          balance = Math.round(balance * 20) / 20;
          console.log(balance);
        }

        const divBalance = document.getElementById("balance");

        divBalance.innerHTML = `Ihr aktueller Saldo ist: ${balance} CHF`;
      } else {
        console.log("No transactions found.");
        const divBalance = document.getElementById("balance");

        divBalance.innerHTML = `Ihr aktueller Saldo ist: 0.00 CHF`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

//go to newTransaction.html on click on this tile
document.addEventListener("DOMContentLoaded", function () {
  // go to newTransaction.html on click on this tile
  const tileNewTransaction = document.getElementById("divNewTransaction");
  tileNewTransaction.addEventListener("click", () => {
    window.location.href = "newTransaction.html";
  });

  //go to showTransactions.html on click on this tile
  const tileShowTransactions = document.getElementById("divShowTransactions");
  tileShowTransactions.addEventListener("click", () => {
    window.location.href = "showTransactions.html";
  });
});
