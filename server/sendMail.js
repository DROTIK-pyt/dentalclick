const nodemailer = require('nodemailer')
const { host, port, user, password } = require('./config/mailConfig')

let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
        user: user,
        pass: password,
    },
})

async function sendEmail(to, subject = "Новое письмо DentalClik", text) {
    try {
        const result = await transporter.sendMail({
            from: `<${user}>`,
            to: to,
            subject: subject,
            html: text,
        })

        return result
    } catch(e) {
        console.log(e.response)
    }
}

module.exports = {
    sendEmail
}