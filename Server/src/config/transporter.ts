import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yolijoli343@gmail.com',
        pass: 'xicz aufp zqnr cgcd'
    }
});

