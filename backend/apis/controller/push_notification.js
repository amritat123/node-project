const axios = require("axios");

// Replace 'YOUR_SERVER_KEY' with your Firebase Cloud Messaging Server Key
const serverKey = "YOUR_SERVER_KEY";

async function sendPushNotification(req, res) {
  const { deviceToken, title, body } = req.body;

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
    res.status(200).json({ message: "Push notification sent successfully" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).json({ error: "Error sending push notification" });
  }
}

module.exports = {
  sendPushNotification,
};
