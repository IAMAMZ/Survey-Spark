const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (req, res, next) => {
  const { name, email, message } = req.body;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: [
      "maqarach@lakeheadu.ca",
      "faconigl@lakeheadu.ca",
      "hcurama@lakeheadu.ca",
    ],
    from: "solvesparktechnologies@gmail.com",
    subject: "New message from client",
    text: "Message from client",
    html: `
    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333;">
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  </div>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  res.render("content/contactSent", {
    title: "Thank you",
    page: "contactSent",
  });
};

module.exports = {
  sendEmail,
};
