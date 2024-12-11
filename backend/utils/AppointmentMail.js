const nodemailer = require("nodemailer");

const sendMailForAppointment = async (options) => {
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
          <p>Thank you for scheduling an appointment with us. Here are the details:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Date:</strong> ${options.date}</li>
            <li><strong>Department:</strong> ${options.depart}</li>
            <li><strong>Reason:</strong> ${options.mesage}</li>
          </ul>
          <p>We will contact you shortly on the ${options.phone} or via this email. For any inquiries, please contact us at <a href="mailto:${process.env.SMPT_MAIL}">${process.env.SMPT_MAIL}</a>.</p>
          <p>Best regards,<br>Mega Medical Complex</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="margin-bottom: 5px;">Visit us at:</p>
          <p style="margin-top: 0;">Mega Medical Complex, Saddar, Rawalpindi, Punjab 46000</p>
          <p style="margin-bottom: 5px;">Contact us:</p>
          <p style="margin-top: 0;">(051) 8481444/+92-51-8483444</p>
           <p style="margin-bottom: 5px;">Email:</p>
          <p style="margin-top: 0;">info@megamedicalcomplex.com.pk</p>
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

module.exports = sendMailForAppointment;
