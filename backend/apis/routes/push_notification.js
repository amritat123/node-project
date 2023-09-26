const express = require("express");
const router = express.Router();
const pushNotificationController = require("../controller/push_notification");

// POST route to send push notifications
router.post("/send", pushNotificationController.sendPushNotification);

module.exports = router;
