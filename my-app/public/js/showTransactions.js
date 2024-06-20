/*
# author: Rahel Hüppi
# version: 1.0
# date: 20.06.2024
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
  fetch(`/transactions?month=${month + 1}&year=${year}`, {
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
          const br = document.createElement("br");
          const button = document.createElement("button");
          button.innerText = "Bearbeiten";

          // if it's an exprense the amount gets multiplied with -1
          let amount = data[i].amount;
          if (data[i].transactionType == "expense") {
            amount = amount * -1;
          }

          // shorten the date, so its only the day
          let date = data[i].date;
          date = date.substr(0, 10);

          // write transactions in HTML
          article.innerText = `${data[i].title}\n ${amount} CHF\n ${date}`;
          divTransactions.append(article);
          divTransactions.append(button);
          divTransactions.append(br); // Doesn't work (works without button)
        }
      } else {
        console.log("No transactions found.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
