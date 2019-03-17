"use strict";
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const nodemailer_1 = require("./config/nodemailer");
let transporter = nodemailer.createTransport({
    host: nodemailer_1.default.host,
    port: nodemailer_1.default.port,
    secure: nodemailer_1.default.secure,
    auth: {
        user: nodemailer_1.default.user,
        pass: nodemailer_1.default.pass
    },
    tls: {
        rejectUnauthorized: nodemailer_1.default.requireTLS,
    }
});
class MailSent {
    /**
     * readHTMLFile
     */
    readHTMLFile(path, callback) {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, function (err, html) {
            if (err) {
                throw err;
            }
            else {
                callback(null, html);
            }
        });
    }
    /**
     * Sent mail
     */
    sendEmail(type, to, subject, userName, otp) {
        if (type == "register") {
            const filePath = path.join(__dirname, 'email_templates', 'register.html');
            this.readHTMLFile(filePath, function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    USER: userName
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: nodemailer_1.default.user,
                    to: to,
                    subject: subject,
                    html: htmlToSend
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("err :", error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
        }
        else if (type == "sendOtp") {
            const filePath = path.join(__dirname, 'email_templates', 'forgotPassword.html');
            this.readHTMLFile(filePath, function (err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    USER: userName,
                    OTP: otp
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: nodemailer_1.default.user,
                    to: to,
                    subject: "Otp sent for password reset.",
                    html: htmlToSend
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
        }
    }
    sentEmailPassword(to, subject, firstName, email, password) {
        const filePath = path.join(__dirname, 'email_templates', 'sendEmailPassword.html');
        this.readHTMLFile(filePath, function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                USER: firstName,
                Email: email,
                Password: password
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: nodemailer_1.default.user,
                to: to,
                subject: subject,
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("err :", error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
}
module.exports = new MailSent();
//# sourceMappingURL=mail_sent.js.map