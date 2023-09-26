const axios = require("axios");
const admin = require("firebase-admin");
const cron = require("node-cron"); // Import the node-cron library

// Replace 'YOUR_SERVER_KEY' with your Firebase Cloud Messaging Server Key
const serverKey = "you_server_key";

// Function to send push notifications
async function sendPushNotification(deviceToken, title, body) {
  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      {
        to: deviceToken,
        notification: {
          title: title,
          body: body,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${serverKey}`,
        },
      }
    );

    console.log("Push notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
// Schedule the sendPushNotification function to run every minute
// cron.schedule("* * * * *", () => {
// Define the push notification parameters here
console.log("cron started in per minute");
const deviceToken = " your_receiver_token"; // token of receiver
const title = "Test Notification";
const body = "This is for testing purpose";

// Call the sendPushNotification function
sendPushNotification(deviceToken, title, body);
// });
