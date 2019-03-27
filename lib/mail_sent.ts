import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import config from './config/nodemailer';

let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
        user: config.user,
        pass: config.pass
    },
    tls: {
        rejectUnauthorized: config.requireTLS,
    }
});

class MailSent {

    /**
     * readHTMLFile 
     */
    public readHTMLFile(path: any, callback: any) {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, function (err, html) {
            if (err) {
                throw err;
            } else {
                callback(null, html);
            }
        });
    }

    /**
     * Sent mail
     */
    public sendEmail(type: string, to: string, subject: string, userName: string, otp: any) {
        if (type == "register") {
            const filePath = path.join(__dirname, 'email_templates', 'register.html');
            this.readHTMLFile(filePath, function (err: any, html: any) {
                var template = handlebars.compile(html);
                var replacements = {
                    USER: userName
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: config.user,
                    to: to,
                    subject: subject,
                    html: htmlToSend
                };
                transporter.sendMail(mailOptions, function (error: any, info: any) {
                    if (error) {
                        console.log("err :", error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
        } else if (type == "sendOtp") {
            const filePath = path.join(__dirname, 'email_templates', 'forgotPassword.html');
            this.readHTMLFile(filePath, function (err: any, html: any) {
                var template = handlebars.compile(html);
                var replacements = {
                    USER: userName,
                    OTP: otp
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: config.user,
                    to: to,
                    subject: "Otp sent for password reset.",
                    html: htmlToSend
                };
                transporter.sendMail(mailOptions, function (error: any, info: any) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
        }
    }

    public sentEmailPassword(to: string, subject: string, firstName: string, email: string, password: string) {
        const filePath = path.join(__dirname, 'email_templates', 'sendEmailPassword.html');
        this.readHTMLFile(filePath, function (err: any, html: any) {
            var template = handlebars.compile(html);
            var replacements = {
                USER: firstName,
                Email: email,
                Password: password
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: config.user,
                to: to,
                subject: subject,
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error: any, info: any) {
                if (error) {
                    console.log("err :", error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
}

export = new MailSent();