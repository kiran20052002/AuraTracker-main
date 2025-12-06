import nodemailer from 'nodemailer';
const sendEmail = async (to, messageContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vamshi2002kirankumar2005@gmail.com",
                pass: "nyihewcatvwyoiej", // Replace with App Password
            },
        });

        const message = {
            from: "vamshi2002kirankumar2005@gmail.com",
            to,
            subject: "🎉 Congratulations! You've Earned a New Badge",
            html: messageContent,
        };

        await transporter.sendMail(message);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;