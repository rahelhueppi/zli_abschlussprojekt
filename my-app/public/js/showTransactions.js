divTransactions = document.getElementById("showTransactions");
const article = document.createElement("article");

// get current month
const now = new Date();
const month = now.getMonth(); // number of months start at 0
const year = now.getFullYear();
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

const h3Month = document.getElementById("currentMonth");
h3Month.innerText = `${nameMonths[month]} ${year}`;

const monthYear = [{ month: `${month + 1}`, year: `${year}` }];

fetch(`/transactions?month=${month + 1}&year=${year}`, {
  method: "GET",
})
  .then((response) => {
    // Use.json() to parse the response body as JSON
    return response.json();
  })
  .then((data) => {
    // data contains parsed json
    console.log(data);

    //see if a transaction was found
    if (data.length > 0) {
      // When the user has transactions
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

        //shorten the date, so its only the day
        let date = data[i].date;
        date = date.substr(0, 10);
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
