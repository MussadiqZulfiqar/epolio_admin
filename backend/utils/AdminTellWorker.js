const nodemailer = require("nodemailer");
const { format } = require("date-fns");

const AdminTellworker = async (options) => {
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
    to: options.doctorEmail, // Send email to the doctor's address
    subject: "New Appointment Request",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #2C3E50; background-color: #f9f9f9; padding: 30px; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #34495E; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <img src="https://static.vecteezy.com/system/resources/previews/004/719/171/non_2x/silhouette-of-a-kid-receiving-polio-vaccine-free-vector.jpg" alt="E-Polio Logo" style="max-width: 150px; height: auto;">
        </div>
        <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 10px 10px;">
          <h1 style="font-size: 24px; color: #2980B9; margin-bottom: 10px;">New Appointment Request</h1>
          <hr style="border: none; height: 1px; background-color: #ddd; margin-bottom: 20px;">
          <p style="font-size: 16px; margin-bottom: 10px;">Hello ${
            options.doctorName
          },</p>
          <p style="font-size: 16px; margin-bottom: 20px;">You have a new appointment request. Here are the details:</p>
          
          <div style="background-color: #ECF0F1; padding: 15px; border-radius: 8px;">
            <p><strong>Patient Name:</strong> ${options.patientName}</p>
            <p><strong>Date Requested:</strong> ${format(
              new Date(options.date),
              "Pp"
            )}</p>
            <p><strong>Contact Information:</strong> ${options.patientEmail}, ${
      options.patientPhone
    }</p>
          </div>

          <p style="margin-top: 20px;">Please review and confirm the appointment at your earliest convenience. You can reach the patient directly via email at <a href="mailto:${
            options.patientEmail
          }" style="color: #3498DB;">${
      options.patientEmail
    }</a> or by phone at ${options.patientPhone}.</p>

          <p style="font-size: 14px; color: #7F8C8D; margin-top: 30px;">Thank you for your dedication to providing excellent care at E-Polio.</p>
          
          <p style="font-size: 12px; color: #7F8C8D; text-align: center; margin-top: 30px;">&copy; ${new Date().getFullYear()} E-Polio. All rights reserved.</p>
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

module.exports = AdminTellworker;
