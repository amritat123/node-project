const stripe = stripe("STRIPE_PUBLIC_KEY");

const element = stripe.element();
console.log("element", element);
const cardElement = element.create("card");

cardElement.mount("#card-element");

const form = document.getElementById("payment-form");
console.log("form", form);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { token, error } = await stripe.createToken(cardElement);

  if (error) {
    // Display error to the user
    const errorElement = document.getElementById("card-error");
    errorElement.textContent = error.message;
    console.log("errorElement", errorElement);
  } else {
    // Send the token to your server
    fetch("/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json.stringify({ amount: document.getElementById("amount").value }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Use data.clientSecret to confirm the payment on the server
        stripe.confirmCardPayment(data.clientSecret).then((result) => {
          if (result.error) {
            //Displaying the error
            console.log(result.error.message);
          } else {
            //Payment Succeeded
            console.log("Payment done successfully", result.paymentIntent);
            alert("payment succeeded");
          }
        });
      });
  }
});
