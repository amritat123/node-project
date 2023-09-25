const Helper = require("../helper/index");
const Email = require("../helper/email");
const StudentModel = require("../model/student");

exports.sendEmail = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    email: "required|email",
    type: "required|in:1,2", //1 = register,  2 = forget password
    resend: "required|in:1,2", // 1 = send 2 = resend
  });
  const matched = await objValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "Validation error",
      error: objValidation.errors,
    });
  }
  const { type, resend } = req.body;
  try {
    let message = "OTP has been sent to email";
    const otp = Helper.generateRandomString(6, true);
    if (resend == 2) {
      message = "OTP has been sent to email";
    }

    if (type == 1) {
      let checkUserEmail = await StudentModel.findOne({
        email: {
          $regex: req.body.email,
          $options: "i",
        },
      });
      if (checkUserEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
      let checkEmail = await LoginVerificationDB.findOne({
        email: {
          $regex: req.body.email,
          $options: "i",
        },
      });
      if (checkEmail) {
        await LoginVerificationDB.findByIdAndUpdate(
          checkEmail._id,
          {
            $set: {
              code: otp,
            },
          },
          {
            new: true,
          }
        );
      } else {
        new LoginVerificationDB({
          email: req.body.email,
          code: otp,
        }).save();
      }
      let subject = "Test - Email Verification";
      const content = `<!DOCTYPE html>
        <html>
        
        <head>
            <title>Signup email verification OTP</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta firstName="viewport" content="width=device-width, initial-scale=1">
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
                    <td bgcolor="#ffffff" align="center" style="padding-top: 30px; padding-bottom: 25px;">
                    <img src="http://dev.saturncube.com:9697/uploads/EmailTemplate/beTh.jpg" alt="Image Description">
                </td>
                
                    </tr> <!-- body content -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td bgcolor="#fff"
                                    style="padding: 19px 33px 16px 33px; font-size: 20px; line-height: 28px;color: #200E32; text-align: center;">
                                    <h2 style="margin: 0; "></h2>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#fff" style="padding: 0 33px 28px 33px; color: #000; ">
                                    <p style="font-size:20px; line-height: 28px; margin: 0;">We are happy to see you signed up for BeThere - your personal event coordinator that will boost your event experience!</p>
                                    <p style="font-size:20px; line-height: 28px; margin: 0;">To start exploring the BeThere App and become part of remarkable events, please confirm your email address by copy / pasting below verification code on your BeThere Sign Up page.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0; text-align: center; color: #000000; ">
                                    <h2><span style="color: #000; line-height: 30px; font-weight: 100">VERIFICATION CODE:</span>  <b>${otp}</b></h2>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#fff" style="padding: 0px 33px 10px 33px; color: #0000; ">
                                    <p style="font-size:20px; line-height: 30px; margin: 0; padding:0">Welcome to BeThere – family of people who will never be late again!
                                    <br> The BeThere Team</p>
                                </td>
                            </tr>
                        </tbody>
                    </table> <!-- footer -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                        <tr>
                        <td align="center" style="background-image:'http://dev.saturncube.com:9697/uploads/EmailTemplate/downBethere.jpg'; background-repeat: no-repeat; background-size: cover; padding: 12px; color: #fff;">
                            <p style="text-align: center; font-size: 20px; line-height: 20px; margin: 0;"> Sent by BeThere Management LLC, 30 N Gould St Ste N, Sheridan, WY 82801.</p>
                        </td>
                    </tr>                  
                        </tbody>
                    </table>
                </table>
            </div>
        </body>
        
        </html>`;
      const sendEmail = Email.SendMail(req.body.email, subject, content, 1);
    } else {
      let checkUserEmail = await StudentModel.findOne({
        email: {
          $regex: req.body.email,
          $options: "i",
        },
      });
      if (checkUserEmail) {
        let checkEmail = await LoginVerificationDB.findOne({
          email: {
            $regex: req.body.email,
            $options: "i",
          },
        });
        if (checkEmail) {
          message =
            "If entered email is registered,you will receive OTP code on the same. Please check mail";
          await LoginVerificationDB.findByIdAndUpdate(
            checkEmail._id,
            {
              $set: {
                code: otp,
              },
            },
            {
              new: true,
            }
          );
        } else {
          new LoginVerificationDB({
            email: req.body.email,
            code: otp,
          }).save();
        }
        let subject = "Forgot password verification code!";
        const data = { otp: otp };
        const content = Helper.forgetPasswordMail(data);
        const sendEmail = Email.SendMail(req.body.email, subject, content, 2);
      } else {
        return res.status(401).json({
          message: "No user with this email found",
        });
      }
      if (resend == 2) {
        message = "OTP has been Resent successfully to email";
      }
    }

    return res.status(200).json({
      message: message,
      result: { code: otp },
    });
  } catch (err) {
    console.log(err);
    const request = req;
    Helper.writeErrorLog(request, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
