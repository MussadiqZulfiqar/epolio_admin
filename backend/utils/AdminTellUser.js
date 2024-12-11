const { format } = require("date-fns");
const nodemailer = require("nodemailer");

const AdminTellUser = async (options) => {
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
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
         <img src="https://static.vecteezy.com/system/resources/previews/004/719/171/original/silhouette-of-a-kid-receiving-polio-vaccine-free-vector.jpg" alt="E-Polio" style="max-width: 200px; height: auto;">
        </div>
        <div style="background-color: #ffffff; padding: 20px;">
          <h2 style="color: #4CAF50; margin-bottom: 20px;">Appointment Confirmation</h2>
          <p>Dear ${options.name},</p>
          <p>${options.message}</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Date:</strong> ${format(
              new Date(options.date),
              "P"
            )}</li>
            <li><strong>Provider:</strong> ${options.providerName}</li>
            <li><strong>Provider Contact:</strong> ${
              options.providerContact
            }</li>
          </ul>
          <p>Best regards,<br>E-Polio Team</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="margin-top: 0;">E-Polio Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = AdminTellUser;
