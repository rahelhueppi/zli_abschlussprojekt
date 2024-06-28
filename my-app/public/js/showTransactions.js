/*
# author: Rahel Hüppi
# version: 1.0
# date: 27.06.2024
# description: to show the Transactions
*/

divTransactions = document.getElementById("showTransactions");
const article = document.createElement("article");

// get current month and year
const now = new Date();
let month = now.getMonth(); // number of months start at 0
let year = now.getFullYear();
const nameMonths = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

// show month and year on the html-page
const h3Month = document.getElementById("currentMonth");
h3Month.innerText = `${nameMonths[month]} ${year}`;

getTransactions(month);

// ArrowBack
const arrowBack = document.getElementById("arrowBack");
arrowBack.addEventListener("click", () => {
  if (month == 0) {
    month = 11;
    year--;
  } else {
    month--;
  }
  h3Month.innerText = `${nameMonths[month]} ${year}`;
  getTransactions(month);
});

// ArrowNext
const arrowNext = document.getElementById("arrowNext");
arrowNext.addEventListener("click", () => {
  if (month == 11) {
    month = 0;
    year++;
  } else {
    month++;
  }
  h3Month.innerText = `${nameMonths[month]} ${year}`;
  getTransactions(month);
});

// current Month
const divCurrentMonth = document.getElementById("divCurrentMonth");
divCurrentMonth.addEventListener("click", () => {
  month = now.getMonth();
  h3Month.innerText = `${nameMonths[month]} ${year}`;
  getTransactions(month);
});

// function for get all Transaction (of a person in a month)
function getTransactions(month) {
  fetch(`/transactions/transactions?month=${month + 1}&year=${year}`, {
    method: "GET",
  })
    .then((response) => {
      // Use.json() to parse the response body as JSON
      return response.json();
    })
    .then((data) => {
      // data contains parsed json
      divTransactions.innerHTML = ""; //empty the div
      //see if a transaction was found
      if (data.length > 0) {
        // create an article-element for every transaction
        for (const i in data) {
          const article = document.createElement("article");
          article.classList.add("article");
          const titleElement = document.createElement("p");
          const priceElement = document.createElement("p");
          const dateElement = document.createElement("p");
          const br = document.createElement("br");
          const button = document.createElement("button");
          button.innerText = "Löschen";
          button.id = data[i].idTransaction;

          //eventListener on click
          button.onclick = function () {
            deleteTransaction(data[i].idTransaction);
          };

          // if it's an exprense the amount gets multiplied with -1
          let amount = data[i].amount;
          if (data[i].transactionType == "expense") {
            amount = amount * -1;
          }

          // function to format date
          function formatDate(date) {
            var d = new Date(date),
              month = "" + (d.getMonth() + 1),
              day = "" + d.getDate(),
              year = d.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            return [year, month, day].join("-");
          }

          // make a date-object with the date (or else the date is one day behind)
          let date = data[i].date;
          date = new Date(date);
          // format the date with the function
          date = formatDate(date);

          // put text in elements
          titleElement.innerText = data[i].title;
          priceElement.innerText = amount + " CHF";
          dateElement.innerText = date;
          // add elements to article
          article.appendChild(titleElement);
          article.appendChild(priceElement);
          article.appendChild(dateElement);
          article.appendChild(button);

          divTransactions.append(article);
          divTransactions.append(br);
        }
      } else {
        console.log("No transactions found.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// function to delete a transaction
async function deleteTransaction(idTransaction) {
  console.log(`delete ${idTransaction}`);
  try {
    const response = await fetch(`/transaction/${idTransaction}`, {
      method: "DELETE",
    });

    if ((response.status = 200)) {
      console.log("Transaction deleted");
    } else {
      console.log(`error: response.status`);
    }
  } catch (error) {
    alert(error);
  }
}
