//@ts-ignore
import nodemailer from "nodemailer";
import UserModel from "./models/UserModel.js";
const sendMail = (req, res) => {
    //@ts-ignore
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "bobbie.gislason@ethereal.email",
            pass: "UCurANP6eCGauTsB2V",
        },
    });
    UserModel.find()
        .then((user) => {
        user.forEach((us) => {
            const message = {
                from: "your_email@gmail.com",
                to: `${us.mail}`,
                subject: "New Book",
                text: "This is a test email sent using Nodemailer!",
            };
            transporter.sendMail(message, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(400).json(error);
                }
                else {
                    console.log("Email sent: " + info.response);
                    res.status(200).json("Mail sent successfully");
                }
            });
        });
    })
        .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    });
};
export default sendMail;
