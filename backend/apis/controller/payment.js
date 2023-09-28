const { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe").STRIPE_SECRET_KEY;

exports.renderPaymentForm = async (req, res) => {
  return res.render("PaymentForm");
};

exports.handlePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    // Creating a payment  on Stripe
    const paymentIntent = await stripe.paymentIntent.create({
      amount: parseInt(amount) * 100,
      currency: "usd",
      description: "This Payment is for product/service",
    });
    // Sending the client secret to the frontend
    return res.status(200).json({
      clientSecret: paymentIntent.clientSecret,
    });
  } catch (error) {
    console.log("error while proceed payment :-", error);
    return res.status(500).json({
      message: "An error occurred while processing your payment.",
      error: error,
    });
  }
};
