const moment = require("moment");
const fs = require("fs");
// const firebaseAdmin = require("firebase-admin");

// var serviceAccount = require("../../localmenu-app-firebase-adminsdk-1axnt-140819bd72.json");

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
//   databaseURL: "https://localmenu-app-default-rtdb.firebaseio.com",
// });
exports.generateRandomString = (length, isNumber = false) => {
  var result = "";
  if (isNumber) {
    var characters = "0123456789";
  } else {
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  z;
};

exports.writeErrorLog = async (req, error) => {
  const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
  const requestBody = JSON.stringify(req.body);
  const date = moment().format("MMMM Do YYYY, h:mm:ss a");
  fs.appendFileSync(
    "errorLog.log",
    "REQUEST DATE : " +
      date +
      "\n" +
      "API URL : " +
      requestURL +
      "\n" +
      "API PARAMETER : " +
      requestBody +
      "\n" +
      "Error : " +
      error +
      "\n\n"
  );
};

//console log function to debug-
exports.customLog = async (...args) => {
  const logLevels = {
    info: "\x1b[36m", // Cyan
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    reset: "\x1b[0m", // Reset to default color
  };

  // Define the log level (default to 'info' if not provided)
  let logLevel = "info";

  // Check if a log level is specified as the first argument
  if (typeof args[0] === "string" && logLevels[args[0]]) {
    logLevel = args[0];
    args.shift(); // Remove the log level from the arguments
  }

  // Get the ANSI escape code for the specified log level
  const logLevelColor = logLevels[logLevel] || "";

  // Log the message with the specified color and style
  console.log(`${logLevelColor}%s${logLevels.reset}`, ...args);
};
// Function to generate email with respective domains
exports.generateEmail = async (uid, signupType) => {
  const domainName = {
    2: "apple.com",
    3: "google.com",
    4: "linkedin.com",
    5: "facebook.com",
  };

  const domain = domainName[signupType];
  if (!domain) {
    throw new Error("Invalid signupType");
  }

  const formattedEmail = `${uid}@${domain}`;
  return formattedEmail;
};

exports.call_msg_ios_notification = async (registration_ids, messages) => {
  const message = {
    notification: {
      title: messages.title,
      body: messages.body,
    },
    tokens: registration_ids,
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: Number(messages.bedge),
        },
      },
    },
    data: {
      type: String(messages.type),
      chat_id: messages.chat_id ? String(messages.chat_id) : "",
    },
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then(async (result) => {
      console.log(result);
    })
    .catch(async (err) => {
      console.log(err);
    });
};

exports.forgetPasswordMail = (data) =>
  `<!DOCTYPE html>
      <html>
      
      <head>
          <title>Signup email verification OTP</title>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <link
              href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
              rel="stylesheet">
          <style>
              body,
              table,
              td,
              a {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
      
              img {
                  -ms-interpolation-mode: bicubic;
              }
      
              /* RESET STYLES */
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
              }
      
              table {
                  border-collapse: collapse !important;
              }
      
              body {
                  height: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100% !important;
              }
      
              @media screen and (max-width:600px) {
                  h1 {
                      font-size: 30px !important;
                      line-height: 34px !important;
                  }
      
                  h2 {
                      font-size: 18px !important;
                      line-height: 26px !important;
                  }
      
                  .profile {
                      width: 180px;
                  }
              }
          </style>
      </head>
      
      <body style="margin: 0 !important; padding: 0 !important; font-family: 'Rubik', sans-serif;">
          <div style="max-width: 900px; margin: 0 auto; padding: 0; width: 100%;">
              <table border="0" bgcolor="#566DCB" cellpadding="0" cellspacing="0" width="100%">
      
                  <tr>
                      <td bgcolor="#000" align="center" style="padding-top: 30px; padding-bottom: 25px;">
                          <h1
                              style="font-family: 'Rubik', sans-serif; font-size:40px; line-height:48px; color: #fff; padding-bottom: 15px; margin: 0;">
                              BeThere. </h1>
      
                      </td>
                  </tr> <!-- body content -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td bgcolor="#fff"
                                  style="padding: 19px 33px 16px 33px; font-size: 20px; line-height: 28px;color: #200E32; text-align: center;">
                                  <h2 style="margin: 0; ">Forgot password verification code!</h2>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 0 33px 28px 33px; color: #000; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">It's seem you have requested for forgot password</p>
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Here is verification code. Please
                                      copy it and verify your email and change your password .</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#000" style="padding: 0; margin-bottom: 28px; text-align: center; color: #fff; ">
                                  <h2>CODE: ${data.otp}</h2>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#fff" style="padding: 28px 33px 10px 33px; color: #200E32; ">
                                  <p style="font-size:20px; line-height: 28px; margin: 0;">Regards, <br> Team BeThere App</p>
                              </td>
                          </tr>
                      </tbody>
                  </table> <!-- footer -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                          <tr>
                              <td align="center" bgcolor="#000" style="padding: 12px; color: #fff;">
                                  <p style="text-align: center; font-size: 14px; line-height: 20px; margin: 0;"> Sent by
                                      BeThere. | Copyright BeThere., 2023 </p>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </table>
          </div>
      </body>
      
      </html>`;
