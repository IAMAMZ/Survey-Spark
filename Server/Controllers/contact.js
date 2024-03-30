const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const sendEmail = async (req, res, next) => {
  const { name, email, message } = req.body;

  const token = req.body['g-recaptcha-response'];

  const googleVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_CAPTCHA}&response=${token}`;

  try{

    const response = await axios.post(googleVerifyURL);

    if(response.data.success){
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


    }
    else{
      // turn them back to contact with captcha error msg
      res.render("content/contact",{
        error:`Captcha verification failed, please make sure to click " I'm not a robot " `
      })
    }
  }
  catch(e){

    console.log(e.message);

    res.render("content/contact",{
      error:"Something went wrong, please try again later "
    })

  }


};

module.exports = {
  sendEmail,
};
