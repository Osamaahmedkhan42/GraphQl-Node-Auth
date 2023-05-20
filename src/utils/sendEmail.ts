import nodemailer from 'nodemailer'

export const emailIt = async options => {

    const smtpTransport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        auth: {
            user: process.env.USER_SB,
            pass: process.env.PASS_SB
        }
    })
    //options
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    await smtpTransport.sendMail(mailOptions)

}


