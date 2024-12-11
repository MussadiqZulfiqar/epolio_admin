const nodemailer = require("nodemailer");
const { format } = require("date-fns");

const PasswordChanged = async (options) => {
  const transporter = nodemailer.createTransport({
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          h2 {
            color: #4CAF50;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Changed Successfully!!</h2>
          <p>Dear ${options.name},</p>
          <p>Your password has been successfully Changed. Here are the details to your new Password:</p>
          <ul>
           
            <li><strong>New Password:</strong> ${options.password}</li>
          </ul>
         
          <p>Best regards,<br>Mega Medical Complex Team</p>
        </div>
      </body>
    </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending  email!!");
  }
};

module.exports = PasswordChanged;
