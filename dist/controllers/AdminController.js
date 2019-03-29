"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const db = require("../database");
const sp = require("../salt_password");
const sm = require("../mail_sent");
const ObjectId = mongodb.ObjectID;
class AdminController {
    /**
     * Admin registration
     */
    adminRegistration(req, res) {
        const request_body = req.body;
        if (request_body.email && request_body.password) {
            const schema = Joi.object().keys({
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Please provide a valid email address").trim().replace(/ /g, ''),
                password: Joi.string().min(6).label("Password should be minimum 6 character long").trim().replace(/ /g, '')
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            status: 400,
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const admin = db.get().collection('admin');
                    admin.find({
                        email: data.email
                    }).toArray(function (err1, docs) {
                        if (err1) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                        else {
                            if (docs.length != 0) {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        status: 403,
                                        message: "Email already exist"
                                    }
                                });
                            }
                            else {
                                const saltedPassword = sp.saltHashPassword(data.password);
                                data.saltKey = saltedPassword.salt;
                                data.salt = saltedPassword.passwordHash;
                                delete data.password;
                                admin.save(data, function (err, success) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    }
                                    else {
                                        sm.sendEmail('register', data.email, 'Welcome to ioMotion', 'Admin', '');
                                        res.status(200).json({
                                            success: true,
                                            data: {
                                                status: 200,
                                                message: "Admin registration successfully, Please login to continue"
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(400).json({
                success: false,
                data: {
                    status: 400,
                    message: "Email and Password are required"
                }
            });
        }
    }
    /**
     * Admin login
     */
    adminLogin(req, res) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        }
        else {
            const request_body = req.body;
            if (request_body.email && request_body.password) {
                const schema = Joi.object().keys({
                    email: Joi.string().email({ minDomainAtoms: 2 }).label("Please provide a valid email address").trim().replace(/ /g, ''),
                    password: Joi.string().min(6).label("Password minimum 6 character long").trim().replace(/ /g, '')
                });
                Joi.validate(request_body, schema, function (err, value) {
                    if (err) {
                        res.status(400).json({
                            success: false,
                            data: {
                                status: 400,
                                message: err.details[0].context.label
                            }
                        });
                    }
                    else {
                        const data = value;
                        const admin = db.get().collection('admin');
                        const authToken = db.get().collection('authToken');
                        if (token == 'null') {
                            admin.find({
                                email: data.email
                            }).toArray(function (err1, docs) {
                                if (err1) {
                                    res.status(500).json({
                                        success: false,
                                        data: {
                                            status: 500,
                                            message: 'Server error'
                                        }
                                    });
                                }
                                else {
                                    if (docs.length != 0) {
                                        const adminData = docs[0];
                                        const decryptedPassword = sp.getPasswordFromHash(adminData.saltKey, data.password);
                                        if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == adminData.salt) {
                                            const jwtToken = jwt.sign({ adminId: new ObjectId(adminData._id), email: adminData.email }, 'ioMotionAdmin', {
                                                expiresIn: 3600
                                            });
                                            if (jwtToken) {
                                                const adminToken = {
                                                    email: adminData.email,
                                                    token: jwtToken,
                                                    createdDate: new Date().getTime(),
                                                    updatedDate: new Date().getTime()
                                                };
                                                authToken.save(adminToken, function (err2, tokenRes) {
                                                    if (err2) {
                                                        res.status(500).json({
                                                            success: false,
                                                            data: {
                                                                status: 500,
                                                                message: 'Server error'
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        adminData.token = tokenRes.ops[0].token;
                                                        delete adminData._id;
                                                        delete adminData.email;
                                                        delete adminData.saltKey;
                                                        delete adminData.salt;
                                                        if (adminData.imageFileName) {
                                                            delete adminData.imageFileName;
                                                        }
                                                        res.status(200).json({
                                                            success: true,
                                                            data: {
                                                                status: 200,
                                                                data: adminData
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            res.status(404).json({
                                                success: false,
                                                data: {
                                                    status: 404,
                                                    message: "Email and password does not match"
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        res.status(404).json({
                                            success: false,
                                            data: {
                                                status: 404,
                                                message: "User not found"
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            jwt.verify(token, 'ioMotionAdmin', function (err3, decoded1) {
                                if (err3) {
                                    if (err3.name == "TokenExpiredError") {
                                        admin.find({
                                            email: data.email
                                        }).toArray(function (err4, docs1) {
                                            if (err4) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: {
                                                        status: 500,
                                                        message: 'Server error'
                                                    }
                                                });
                                            }
                                            else {
                                                if (docs1.length != 0) {
                                                    const adminData = docs1[0];
                                                    const decryptedPassword = sp.getPasswordFromHash(adminData.saltKey, data.password);
                                                    if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == adminData.salt) {
                                                        authToken.find({ email: data.email }).toArray(function (err5, tokenRes1) {
                                                            if (err5) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    data: {
                                                                        status: 500,
                                                                        message: 'Server error'
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                const tokRes = tokenRes1[0];
                                                                const jwtToken = jwt.sign({ adminId: new ObjectId(adminData._id), email: adminData.email }, 'ioMotionAdmin', {
                                                                    expiresIn: 3600
                                                                });
                                                                if (jwtToken) {
                                                                    tokRes.token = jwtToken;
                                                                    tokRes.updatedDate = new Date().getTime();
                                                                    authToken.update({
                                                                        email: data.email
                                                                    }, {
                                                                        $set: tokRes
                                                                    }, {
                                                                        upsert: true
                                                                    }, function (err6, tokenUpdate) {
                                                                        if (err6) {
                                                                            res.status(500).json({
                                                                                success: false,
                                                                                data: {
                                                                                    status: 500,
                                                                                    message: 'Server error'
                                                                                }
                                                                            });
                                                                        }
                                                                        else {
                                                                            adminData.token = jwtToken;
                                                                            delete adminData._id;
                                                                            delete adminData.email;
                                                                            delete adminData.saltKey;
                                                                            delete adminData.salt;
                                                                            res.status(200).json({
                                                                                success: true,
                                                                                data: {
                                                                                    status: 200,
                                                                                    adminDetails: adminData
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        res.status(404).json({
                                                            success: false,
                                                            data: {
                                                                status: 404,
                                                                message: "Email and password does not match"
                                                            }
                                                        });
                                                    }
                                                }
                                                else {
                                                    res.status(404).json({
                                                        success: false,
                                                        data: {
                                                            status: 404,
                                                            message: "User not found"
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    else if (err3.name == "JsonWebTokenError") {
                                        res.status(401).json({
                                            success: false,
                                            data: {
                                                status: 401,
                                                message: 'Unauthorized'
                                            }
                                        });
                                    }
                                    else {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    }
                                }
                                else {
                                    admin.find({
                                        email: decoded1.email
                                    }).toArray(function (err7, docs2) {
                                        if (err7) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        }
                                        else {
                                            if (docs2.length != 0) {
                                                const adminData = docs2[0];
                                                const decryptedPassword = sp.getPasswordFromHash(adminData.saltKey, data.password);
                                                if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == adminData.salt) {
                                                    authToken.find({ email: decoded1.email }).toArray(function (err8, tokenRes3) {
                                                        if (err8) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    token: tokenRes3[0].token
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.status(404).json({
                                                        success: false,
                                                        data: {
                                                            status: 404,
                                                            message: "Email and password does not match"
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                res.status(404).json({
                                                    success: false,
                                                    data: {
                                                        status: 404,
                                                        message: "User not found"
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    data: {
                        status: 400,
                        message: "Email and Password are required"
                    }
                });
            }
        }
    }
    /**
     * Otp send
     */
    sendOtp(req, res) {
        const request_body = req.body;
        if (request_body.email) {
            const schema = Joi.object().keys({
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Please provide a valid email address").trim().replace(/ /g, '')
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            status: 400,
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const admin = db.get().collection('admin');
                    const userTemp = db.get().collection('userTemp');
                    admin.find({
                        email: data.email
                    }).toArray(function (err1, docs) {
                        if (err1) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                        else {
                            if (docs.length != 0) {
                                const otp = Math.floor(100000 + Math.random() * 900000);
                                userTemp.find({
                                    email: data.email
                                }).toArray(function (err2, response1) {
                                    if (err2) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    }
                                    else {
                                        if (response1.length != 0) {
                                            userTemp.remove({
                                                email: data.email
                                            }, function (err3, res2) {
                                                if (err3) {
                                                    res.status(500).json({
                                                        success: false,
                                                        data: {
                                                            status: 500,
                                                            message: 'Server error'
                                                        }
                                                    });
                                                }
                                                else {
                                                    sm.sendEmail('sendOtp', data.email, 'Otp sent for password reset.', 'Admin', otp);
                                                    userTemp.save({
                                                        email: data.email,
                                                        otp: otp
                                                    }, function (err4, res3) {
                                                        if (err4) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Plesae check your mail for the otp"
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            sm.sendEmail('sendOtp', data.email, 'Otp sent for password reset.', 'Admin', otp);
                                            userTemp.save({
                                                email: data.email,
                                                otp: otp
                                            }, function (err5, res4) {
                                                if (err5) {
                                                    res.status(500).json({
                                                        success: false,
                                                        data: {
                                                            status: 500,
                                                            message: 'Server error'
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            status: 200,
                                                            message: "Plesae check your mail for the otp"
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else {
                                res.status(404).json({
                                    success: false,
                                    data: {
                                        status: 404,
                                        message: "User not found"
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(400).json({
                success: false,
                data: {
                    status: 400,
                    message: "Email is required"
                }
            });
        }
    }
    /**
     * Reset password
     */
    passwordReset(req, res) {
        const request_body = req.body;
        if (request_body.email && request_body.password && request_body.otp) {
            const schema = Joi.object().keys({
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Please provide a valid email address").trim().replace(/ /g, ''),
                password: Joi.string().min(6).label("Password should be minimum 6 character long").trim().replace(/ /g, ''),
                otp: Joi.string().length(6).label("Otp is 6 character long")
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            status: 400,
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const admin = db.get().collection('admin');
                    const useTemp = db.get().collection('userTemp');
                    useTemp.find({
                        email: data.email
                    }).toArray(function (err1, res1) {
                        if (err1) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                        else {
                            if (res1.length != 0) {
                                if (res1[0].otp == data.otp) {
                                    const saltedPassword = sp.saltHashPassword(data.password);
                                    data.saltKey = saltedPassword.salt;
                                    data.salt = saltedPassword.passwordHash;
                                    admin.update({
                                        email: data.email
                                    }, {
                                        $set: {
                                            saltKey: data.saltKey,
                                            salt: data.salt
                                        }
                                    }, {
                                        upsert: true
                                    }, function (err2, res2) {
                                        if (err2) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        }
                                        else {
                                            useTemp.remove({
                                                "_id": new ObjectId(res1[0]._id)
                                            }, function (err5, res5) {
                                                if (err5) {
                                                    res.status(500).json({
                                                        success: false,
                                                        data: {
                                                            status: 500,
                                                            message: 'Server error'
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            status: 200,
                                                            message: "Password changed successfully, Please login to continue"
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(404).json({
                                        success: false,
                                        data: {
                                            status: 404,
                                            message: "Otp does not match"
                                        }
                                    });
                                }
                            }
                            else {
                                res.status(404).json({
                                    success: false,
                                    data: {
                                        status: 404,
                                        message: "User not found"
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(400).json({
                success: false,
                data: {
                    status: 400,
                    message: "Email, Password and otp are required"
                }
            });
        }
    }
    /**
     * Get admin details
     */
    getAdminById(req, res) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        }
        else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (err, decoded) {
                    if (err) {
                        if (err.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (err.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    }
                    else {
                        const tokenRes = decoded;
                        const admin = db.get().collection('admin');
                        admin.find({
                            _id: new ObjectId(tokenRes.adminId)
                        }).toArray(function (err1, success) {
                            if (err1) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        status: 500,
                                        message: 'Server error'
                                    }
                                });
                            }
                            else {
                                if (success.length != 0) {
                                    const adminDetails = success[0];
                                    delete adminDetails.salt;
                                    delete adminDetails.saltKey;
                                    delete adminDetails._id;
                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            status: 200,
                                            adminDetails: adminDetails
                                        }
                                    });
                                }
                                else {
                                    res.status(404).json({
                                        success: false,
                                        data: {
                                            status: 404,
                                            message: "User not found"
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    }
    /**
     * Update admin details
     */
    updateAdmin(req, res) {
        const token = req.headers['authorization'];
        const request_body = req.body;
        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        }
        else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (err, decoded) {
                    if (err) {
                        if (err.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (err.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    }
                    else {
                        const tokenRes = decoded;
                        const admin = db.get().collection('admin');
                        admin.find({
                            _id: new ObjectId(tokenRes.adminId)
                        }).toArray(function (err1, success) {
                            if (err1) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        status: 500,
                                        message: 'Server error'
                                    }
                                });
                            }
                            else {
                                if (success.length != 0) {
                                    delete request_body._id;
                                    admin.update({
                                        _id: new ObjectId(tokenRes.adminId)
                                    }, {
                                        $set: request_body
                                    }, {
                                        upsert: true
                                    }, function (err2, res2) {
                                        if (err2) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    status: 200,
                                                    message: "Admin details updated successfully"
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(404).json({
                                        success: false,
                                        data: {
                                            status: 404,
                                            message: "User not found"
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    }
    /**
     * Change password
     */
    changePassword(req, res) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        }
        else {
            const request_body = req.body;
            if (request_body.oldPassword && request_body.newPassword) {
                const schema = Joi.object().keys({
                    oldPassword: Joi.string().min(6).label("Old password should be minimum 6 character long").trim().replace(/ /g, ''),
                    newPassword: Joi.string().min(6).label("New password should be minimum 6 character long").trim().replace(/ /g, '')
                });
                Joi.validate(request_body, schema, function (err, value) {
                    if (err) {
                        res.status(400).json({
                            success: false,
                            data: {
                                status: 400,
                                message: err.details[0].context.label
                            }
                        });
                    }
                    else {
                        const data = value;
                        const admin = db.get().collection('admin');
                        if (token != 'null') {
                            jwt.verify(token, 'ioMotionAdmin', function (err1, decoded) {
                                if (err1) {
                                    if (err1.name == "TokenExpiredError") {
                                        res.status(401).json({
                                            success: false,
                                            data: {
                                                status: 401,
                                                message: 'Unauthorized'
                                            }
                                        });
                                    }
                                    else if (err1.name == "JsonWebTokenError") {
                                        res.status(401).json({
                                            success: false,
                                            data: {
                                                status: 401,
                                                message: 'Unauthorized'
                                            }
                                        });
                                    }
                                    else {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    }
                                }
                                else {
                                    const tokenRes = decoded;
                                    admin.find({
                                        email: tokenRes.email
                                    }).toArray(function (err2, res1) {
                                        if (err2) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        }
                                        else {
                                            if (res1.length != 0) {
                                                const userData = res1[0];
                                                const decryptedPassword = sp.getPasswordFromHash(userData.saltKey, data.oldPassword);
                                                if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
                                                    const saltedPassword = sp.saltHashPassword(data.newPassword);
                                                    data.saltKey = saltedPassword.salt;
                                                    data.salt = saltedPassword.passwordHash;
                                                    admin.update({
                                                        email: tokenRes.email
                                                    }, {
                                                        $set: {
                                                            saltKey: data.saltKey,
                                                            salt: data.salt
                                                        }
                                                    }, {
                                                        upsert: true
                                                    }, function (err3, res2) {
                                                        if (err3) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Password changed successfully, Please login to continue"
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.status(404).json({
                                                        success: false,
                                                        data: {
                                                            status: 404,
                                                            message: "Please enter your old password correctly"
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                res.status(404).json({
                                                    success: false,
                                                    data: {
                                                        status: 404,
                                                        message: "User not found"
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    data: {
                        status: 400,
                        message: "Old Password and new password are required"
                    }
                });
            }
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map