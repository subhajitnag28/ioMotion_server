"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const Joi = require("joi");
const db = require("../database");
const sp = require("../salt_password");
const sm = require("../mail_sent");
const ObjectId = mongodb.ObjectID;
class UserController {
    /**
     * User registration
     */
    userRegistration(req, res) {
        const request_body = req.body;
        if (request_body.firstName &&
            request_body.lastName &&
            request_body.email &&
            request_body.password &&
            request_body.phone &&
            request_body.streetAddress &&
            request_body.city &&
            request_body.state &&
            request_body.zipCode &&
            request_body.role &&
            request_body.registeredBy &&
            request_body.registeredById) {
            const schema = Joi.object().keys({
                firstName: Joi.string().min(3).max(25).label('Firstname should be within 3 to 25 character long').required(),
                lastName: Joi.string().min(3).max(25).label('Lastname should be within 3 to 25 character long').required(),
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Invalid email").required(),
                password: Joi.string().min(6).label("Password minimum 6 character long").required(),
                phone: Joi.number().min(6).label("Phone number minimum 6 character long").required(),
                streetAddress: Joi.string().min(3).label("Street address minimum 3 character long").required(),
                city: Joi.string().min(3).label("City minimum 3 character long").required(),
                state: Joi.string().min(3).label("State minimum 3 character long").required(),
                zipCode: Joi.number().min(3).label("Zipcode minimum 3 character long").required(),
                role: Joi.string().label("Role is required").required(),
                registeredBy: Joi.string().label("RegisterBy is required").required(),
                registeredById: Joi.string()
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({
                        email: data.email
                    }).toArray(function (err, docs) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: err
                            });
                        }
                        else {
                            if (docs.length != 0) {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        message: "Email already exist"
                                    }
                                });
                            }
                            else {
                                const saltedPassword = sp.saltHashPassword(data.password);
                                data.saltKey = saltedPassword.salt;
                                data.salt = saltedPassword.passwordHash;
                                data.registeredById = data.registeredById != 0 ? new ObjectId(data.registeredById) : data.registeredById;
                                const customerPassword = data.password;
                                delete data.password;
                                if (data.role == "user") {
                                    data.installMicroserviceAccess = false;
                                }
                                user.save(data, function (err, success) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: err
                                        });
                                    }
                                    else {
                                        const customerDetails = success.ops[0];
                                        if (customerDetails.registeredBy == "self") {
                                            sm.sendEmail('register', data.email, 'Welcome to ioMotion', customerDetails.firstName, '');
                                        }
                                        else {
                                            sm.sentEmailPassword(data.email, 'Welcome to ioMotion', data.firstName, data.email, customerPassword);
                                        }
                                        res.status(200).json({
                                            success: true,
                                            data: {
                                                message: "User registration successfully"
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
            res.status(403).json({
                success: false,
                data: {
                    message: "All fileds are required"
                }
            });
        }
    }
    /**
     * User login
     */
    userLogin(req, res) {
        const request_body = req.body;
        if (request_body.email && request_body.password && request_body.role) {
            const schema = Joi.object().keys({
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Invalid email").required(),
                password: Joi.string().min(6).label("Password minimum 6 character long").required(),
                role: Joi.string().min(4).max(8).label("Role is required").required()
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({
                        email: data.email,
                        role: data.role
                    }).toArray(function (err, docs) {
                        if (docs.length != 0) {
                            const userData = docs[0];
                            const decryptedPassword = sp.getPasswordFromHash(userData.saltKey, data.password);
                            if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        userDetails: userData
                                    }
                                });
                            }
                            else {
                                res.status(404).json({
                                    success: false,
                                    data: {
                                        message: "Email and password does not match"
                                    }
                                });
                            }
                        }
                        else {
                            res.status(404).json({
                                success: false,
                                data: {
                                    message: "User not found"
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Email, Password and role are required"
                }
            });
        }
    }
    /**
     * Otp send
     */
    sendOtp(req, res) {
        const request_body = req.body;
        if (request_body.email) {
            const schema = Joi.object().keys({
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Invalid email")
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    const userTemp = db.get().collection('userTemp');
                    user.find({
                        email: data.email
                    }).toArray(function (err, docs) {
                        if (docs.length != 0) {
                            const otp = Math.floor(100000 + Math.random() * 900000);
                            userTemp.find({
                                email: data.email
                            }).toArray(function (err1, response1) {
                                if (err1) {
                                    res.status(500).json({
                                        success: false,
                                        data: {
                                            message: err1
                                        }
                                    });
                                }
                                else {
                                    if (response1.length != 0) {
                                        userTemp.remove({
                                            email: data.email
                                        }, function (err2, res2) {
                                            if (err2) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: {
                                                        message: err2
                                                    }
                                                });
                                            }
                                            else {
                                                sm.sendEmail('sendOtp', data.email, 'Otp sent for password reset.', docs[0].firstName, otp);
                                                userTemp.save({
                                                    email: data.email,
                                                    otp: otp
                                                }, function (err3, res3) {
                                                    if (err3) {
                                                        res.status(500).json({
                                                            success: false,
                                                            data: {
                                                                message: err3
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        res.status(200).json({
                                                            success: true,
                                                            data: {
                                                                message: "Plesae check your mail for the otp"
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        sm.sendEmail('sendOtp', data.email, 'Otp sent for password reset.', docs[0].firstName, otp);
                                        userTemp.save({
                                            email: data.email,
                                            otp: otp
                                        }, function (err4, res4) {
                                            if (err4) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: {
                                                        message: err4
                                                    }
                                                });
                                            }
                                            else {
                                                res.status(200).json({
                                                    success: true,
                                                    data: {
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
                                    message: "User not found"
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
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
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Invalid email"),
                password: Joi.string().min(6).label("Password minimum 6 character long"),
                otp: Joi.string().min(6).label("Otp minimum 6 character long")
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    const useTemp = db.get().collection('userTemp');
                    useTemp.find({
                        email: data.email
                    }).toArray(function (err, res1) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    message: err
                                }
                            });
                        }
                        else {
                            if (res1.length > 0) {
                                if (res1[0].otp == data.otp) {
                                    const saltedPassword = sp.saltHashPassword(data.password);
                                    data.saltKey = saltedPassword.salt;
                                    data.salt = saltedPassword.passwordHash;
                                    user.update({
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
                                                    message: err2
                                                }
                                            });
                                        }
                                        else {
                                            useTemp.remove({
                                                "_id": new ObjectId(res1[0]._id)
                                            }, function (err5, res5) {
                                                if (err5) {
                                                    res.status(500).json({
                                                        status: false,
                                                        data: err5
                                                    });
                                                }
                                                else {
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            message: "Password changed successfully. Please login"
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(403).json({
                                        success: false,
                                        data: {
                                            message: "Otp does not match"
                                        }
                                    });
                                }
                            }
                            else {
                                res.status(403).json({
                                    success: false,
                                    data: {
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
            res.status(403).json({
                success: false,
                data: {
                    message: "Email, Password and otp are required"
                }
            });
        }
    }
    /**
     * Get user by Id
     */
    getUserById(req, res) {
        const request_body = req.param('id');
        if (request_body) {
            const user = db.get().collection('user');
            user.find({
                _id: new ObjectId(request_body)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length > 0) {
                        const toSendData = success[0];
                        res.status(200).json({
                            success: true,
                            data: {
                                userDetails: toSendData
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "User not found"
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "User Id is required"
                }
            });
        }
    }
    /**
     * Get Users and customer by role by admin
     */
    getUsersByRole(req, res) {
        const request_body = req.body;
        if (request_body.role && request_body.page && request_body.size) {
            const schema = Joi.object().keys({
                role: Joi.string().min(4).max(8).label("Role is required").required(),
                page: Joi.string().min(1).max(1).label("page number is required").required(),
                size: Joi.string().min(1).max(2).label("size is required").required()
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({ role: data.role })
                        .toArray(function (err, success) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    message: err
                                }
                            });
                        }
                        else {
                            const pageNo = parseInt(data.page);
                            const size = parseInt(data.size);
                            if (pageNo < 0 || pageNo === 0) {
                                res.status(403).json({
                                    success: false,
                                    data: "Please provide valid page no"
                                });
                            }
                            else {
                                user.find({
                                    role: data.role
                                }, {}, { skip: size * (pageNo - 1), limit: size })
                                    .toArray(function (err1, success1) {
                                    if (err1) {
                                        res.status(500).json({
                                            success: false,
                                            data: err1
                                        });
                                    }
                                    else {
                                        if (success1.length != 0) {
                                            const userList = success1;
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    userDetails: userList,
                                                    userListCount: success.length
                                                }
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    userDetails: [],
                                                    userListCount: 0
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Fields are required"
                }
            });
        }
    }
    /**
     * Get Users by role and customer id by customer
     */
    getUsersByRoleAndCustomerId(req, res) {
        const request_body = req.body;
        if (request_body.role && request_body.customerId && request_body.page && request_body.size) {
            const schema = Joi.object().keys({
                customerId: Joi.string().label("Customer id is required").required(),
                role: Joi.string().min(4).max(8).label("Role is required").required(),
                page: Joi.string().min(1).max(1).label("page number is required").required(),
                size: Joi.string().min(1).max(2).label("size is required").required()
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({ role: data.role, registeredById: new ObjectId(data.customerId) })
                        .toArray(function (err, success) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    message: err
                                }
                            });
                        }
                        else {
                            const pageNo = parseInt(data.page);
                            const size = parseInt(data.size);
                            if (pageNo < 0 || pageNo === 0) {
                                res.status(403).json({
                                    success: false,
                                    data: "Please provide valid page no"
                                });
                            }
                            else {
                                user.find({
                                    role: data.role,
                                    registeredById: new ObjectId(data.customerId)
                                }, {}, { skip: size * (pageNo - 1), limit: size })
                                    .toArray(function (err1, success1) {
                                    if (err1) {
                                        res.status(500).json({
                                            success: false,
                                            data: err1
                                        });
                                    }
                                    else {
                                        if (success1.length != 0) {
                                            const userList = success1;
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    userDetails: userList,
                                                    userListCount: success.length
                                                }
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    userDetails: [],
                                                    userListCount: 0
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Fields are required"
                }
            });
        }
    }
    /**
     * Update user by Id
     */
    updateUser(req, res) {
        const request_body = req.body;
        if (request_body._id) {
            const user = db.get().collection('user');
            user.find({
                _id: new ObjectId(request_body._id)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length > 0) {
                        const user_id = request_body._id;
                        delete request_body._id;
                        user.update({
                            _id: new ObjectId(user_id)
                        }, {
                            $set: request_body
                        }, {
                            upsert: true
                        }, function (err2, res2) {
                            if (err2) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        message: err2
                                    }
                                });
                            }
                            else {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        message: "User details updated successfully"
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "User not found"
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "User Id is required"
                }
            });
        }
    }
    /**
     * Change password
     */
    changePassword(req, res) {
        const request_body = req.body;
        if (request_body.email && request_body.oldPassword && request_body.newPassword) {
            const schema = Joi.object().keys({
                email: Joi.string().email({ minDomainAtoms: 2 }).label("Invalid email"),
                oldPassword: Joi.string().min(6).label("Password minimum 6 character long"),
                newPassword: Joi.string().min(6).label("Password minimum 6 character long")
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({
                        email: data.email
                    }).toArray(function (err, res1) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    message: err
                                }
                            });
                        }
                        else {
                            if (res1.length > 0) {
                                const userData = res1[0];
                                const decryptedPassword = sp.getPasswordFromHash(userData.saltKey, data.oldPassword);
                                if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
                                    const saltedPassword = sp.saltHashPassword(data.newPassword);
                                    data.saltKey = saltedPassword.salt;
                                    data.salt = saltedPassword.passwordHash;
                                    user.update({
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
                                                    message: err2
                                                }
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    message: "Password changed successfully"
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(403).json({
                                        success: false,
                                        data: {
                                            message: "Please enter your old password correctly"
                                        }
                                    });
                                }
                            }
                            else {
                                res.status(403).json({
                                    success: false,
                                    data: {
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
            res.status(403).json({
                success: false,
                data: {
                    message: "Email and Old Password are not matched"
                }
            });
        }
    }
    /**
     * Delete user
     */
    deleteUser(req, res) {
        const requestBody = req.param('id');
        if (requestBody) {
            const user = db.get().collection('user');
            user.find({
                _id: new ObjectId(requestBody)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        user.remove({
                            "_id": new ObjectId(requestBody)
                        }, function (err2, res2) {
                            if (err2) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        message: err2
                                    }
                                });
                            }
                            else {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        message: "User deleted successfully"
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: "User not found"
            });
        }
    }
    /**
     * Search user by admin
     */
    searchUser(req, res) {
        const request_body = req.body;
        if (request_body.name && request_body.page && request_body.size && request_body.role) {
            const schema = Joi.object().keys({
                name: Joi.string().min(1).max(30).label("Name is required").required(),
                page: Joi.string().min(1).max(10).label("page number is required").required(),
                size: Joi.string().min(1).max(2).label("size is required").required(),
                role: Joi.string().min(4).max(8).label("Role is required").required(),
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    let query = {};
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({ role: data.role })
                        .toArray(function (err, success) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: err
                            });
                        }
                        else {
                            const pageNo = parseInt(data.page);
                            const size = parseInt(data.size);
                            if (pageNo < 0 || pageNo === 0) {
                                res.status(403).json({
                                    success: false,
                                    data: "Please provide valid page no"
                                });
                            }
                            else {
                                if (data.name) {
                                    const x = [data.name], regex = x.map(function (e) {
                                        return new RegExp(e, "i");
                                    });
                                    query["firstName"] = {
                                        $in: regex
                                    };
                                }
                                if (data.role) {
                                    query.role = data.role;
                                }
                                user.find(query, {}, { skip: size * (pageNo - 1), limit: size })
                                    .toArray(function (err1, success1) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: err1
                                        });
                                    }
                                    else {
                                        if (success1.length != 0) {
                                            const userList = success1;
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    userDetails: userList,
                                                    userListCount: success.length
                                                }
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                success: false,
                                                data: {
                                                    userDetails: [],
                                                    message: "Users not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Fields are required"
                }
            });
        }
    }
    /**
     * Search user by customer
     */
    searchUserByCustomer(req, res) {
        const request_body = req.body;
        if (request_body.name && request_body.page && request_body.size && request_body.role && request_body.customerId) {
            const schema = Joi.object().keys({
                customerId: Joi.string().label("Custoer id is required").required(),
                name: Joi.string().min(1).max(30).label("Name is required").required(),
                page: Joi.string().min(1).max(1).label("page number is required").required(),
                size: Joi.string().min(1).max(2).label("size is required").required(),
                role: Joi.string().min(4).max(8).label("Role is required").required(),
            });
            Joi.validate(request_body, schema, function (err, value) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                }
                else {
                    let query = {};
                    const data = value;
                    const user = db.get().collection('user');
                    user.find({ role: data.role, registeredById: new ObjectId(data.customerId) })
                        .toArray(function (err, success) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                data: err
                            });
                        }
                        else {
                            const pageNo = parseInt(data.page);
                            const size = parseInt(data.size);
                            if (pageNo < 0 || pageNo === 0) {
                                res.status(403).json({
                                    success: false,
                                    data: "Please provide valid page no"
                                });
                            }
                            else {
                                if (data.name) {
                                    const x = [data.name], regex = x.map(function (e) {
                                        return new RegExp(e, "i");
                                    });
                                    query["firstName"] = {
                                        $in: regex
                                    };
                                }
                                if (data.role) {
                                    query.role = data.role;
                                }
                                if (data.customerId) {
                                    query.registeredById = new ObjectId(data.customerId);
                                }
                                user.find(query, {}, { skip: size * (pageNo - 1), limit: size })
                                    .toArray(function (err1, success1) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: err1
                                        });
                                    }
                                    else {
                                        if (success1.length != 0) {
                                            const userList = success1;
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    userDetails: userList,
                                                    userListCount: success.length
                                                }
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                success: false,
                                                data: {
                                                    userDetails: [],
                                                    message: "Users not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Fields are required"
                }
            });
        }
    }
    /**
        * provide perticular user to install microservices
        *
        * _id, microserviceInstallAccess
        */
    userAccessToInstallMicroservices(req, res) {
        const request_body = req.body;
        if (request_body._id) {
            const user = db.get().collection('user');
            user.find({
                _id: new ObjectId(request_body._id)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        const user_id = request_body._id;
                        delete request_body._id;
                        user.update({
                            _id: new ObjectId(user_id)
                        }, {
                            $set: request_body
                        }, {
                            upsert: true
                        }, function (err2, res2) {
                            if (err2) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        message: err2
                                    }
                                });
                            }
                            else {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        message: "User access to install microservices granted"
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "User not found"
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                data: {
                    message: "User Id is required"
                }
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map