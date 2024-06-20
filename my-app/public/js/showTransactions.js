fetch(`/transactions`, {
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
      console.log(data[0].title);
      alert(data[0].title);
    } else {
      console.log("No transactions found.");
    }
  })
  .catch((error) => {
    console.error(error);
  });
