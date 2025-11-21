import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import ejs from 'ejs';
import transporter from "../config/transporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const sendEmail = async({email, subject, template, context}) => {
    const templatePath = path.join(__dirname, '../views/emails', template);

    const html = await ejs.renderFile(templatePath, context);

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions);
}

export default sendEmail;