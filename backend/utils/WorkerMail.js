const nodemailer = require("nodemailer");

const sendMailToWOrker = async (options) => {
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
            <h2>Registration Successful</h2>
            <p>Dear ${options.name},</p>
            <p>Welcome to E-Polio! You have been successfully registered as a ${options.type}.</p>
            <p>Please use the following credentials to log in to E-Polio Console:</p>
            <ul>
              <li><strong>Email:</strong> ${options.email}</li>
              <li><strong>Password:</strong> ${options.lastFiveDigits}</li>
            </ul>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>E-Polio Team</p>
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

module.exports = sendMailToWOrker;
