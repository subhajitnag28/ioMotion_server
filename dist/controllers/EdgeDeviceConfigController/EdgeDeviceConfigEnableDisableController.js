"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const db = require("../../database");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongodb.ObjectID;
class EdgeDeviceConfigEnableDisableController {
    /**
     * Controller config enable or disable
     */
    enableDisableControllerConfig(req, res) {
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
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr, decoded) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (jwtErr.name == "JsonWebTokenError") {
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
                        const request_body = req.body;
                        if (request_body.customerId
                            && request_body.installed) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_device_config = db.get().collection('edge_device_config');
                                let message;
                                if (request_body.installed == true) {
                                    message = "Controller config enabled successfully";
                                }
                                else {
                                    message = "Controller config disabled successfully";
                                }
                                edge_device_config.find({
                                    customer_id: new ObjectId(request_body.customer_id)
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
                                            const deviceConfigValue = success[0];
                                            deviceConfigValue.installed = request_body.installed;
                                            edge_device_config.update({
                                                _id: new ObjectId(success[0]._id)
                                            }, {
                                                $set: deviceConfigValue
                                            }, {
                                                upsert: true
                                            }, function (err2, success1) {
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
                                                            message: message
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
                                                    message: "Controller config not installed"
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
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id and installed value are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
    /**
     * Wifi config enable or disable
     */
    enableDisableWifiConfig(req, res) {
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
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr, decoded) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (jwtErr.name == "JsonWebTokenError") {
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
                        const request_body = req.body;
                        if (request_body.customerId
                            && request_body.installed) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_wifi_config = db.get().collection('edge_wifi_config');
                                let message;
                                if (request_body.installed == true) {
                                    message = "Wifi config enabled successfully";
                                }
                                else {
                                    message = "Wifi config disabled successfully";
                                }
                                edge_wifi_config.find({
                                    customer_id: new ObjectId(request_body.customer_id)
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
                                            const wifiConfigValue = success[0];
                                            wifiConfigValue.installed = request_body.installed;
                                            edge_wifi_config.update({
                                                _id: new ObjectId(success[0]._id)
                                            }, {
                                                $set: wifiConfigValue
                                            }, {
                                                upsert: true
                                            }, function (err2, success1) {
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
                                                            message: message
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
                                                    message: "Wifi config not installed"
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
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id and installed value are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
    /**
    * Carrier config enable or disable
    */
    enableDisableCarrierConfig(req, res) {
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
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr, decoded) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (jwtErr.name == "JsonWebTokenError") {
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
                        const request_body = req.body;
                        if (request_body.customerId
                            && request_body.installed) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_carrier_config = db.get().collection('edge_carrier_config');
                                let message;
                                if (request_body.installed == true) {
                                    message = "Carrier config enabled successfully";
                                }
                                else {
                                    message = "Carrier config disabled successfully";
                                }
                                edge_carrier_config.find({
                                    customer_id: new ObjectId(request_body.customer_id)
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
                                            const carrierConfigValue = success[0];
                                            carrierConfigValue.installed = request_body.installed;
                                            edge_carrier_config.update({
                                                _id: new ObjectId(success[0]._id)
                                            }, {
                                                $set: carrierConfigValue
                                            }, {
                                                upsert: true
                                            }, function (err2, success1) {
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
                                                            message: message
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
                                                    message: "Carrier config not installed"
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
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id and installed value are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
    /**
    * Ble config enable or disable
    */
    enableDisableBleConfig(req, res) {
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
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr, decoded) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (jwtErr.name == "JsonWebTokenError") {
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
                        const request_body = req.body;
                        if (request_body.customerId
                            && request_body.installed) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_ble_config = db.get().collection('edge_ble_config');
                                let message;
                                if (request_body.installed == true) {
                                    message = "Ble config enabled successfully";
                                }
                                else {
                                    message = "Ble config disabled successfully";
                                }
                                edge_ble_config.find({
                                    customer_id: new ObjectId(request_body.customer_id)
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
                                            const bleConfigValue = success[0];
                                            bleConfigValue.installed = request_body.installed;
                                            edge_ble_config.update({
                                                _id: new ObjectId(success[0]._id)
                                            }, {
                                                $set: bleConfigValue
                                            }, {
                                                upsert: true
                                            }, function (err2, success1) {
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
                                                            message: message
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
                                                    message: "Ble config not installed"
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
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id and installed value are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
    /**
    * Troubleshoot config enable or disable
    */
    enableDisableTroubleshootConfig(req, res) {
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
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr, decoded) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        }
                        else if (jwtErr.name == "JsonWebTokenError") {
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
                        const request_body = req.body;
                        if (request_body.customerId
                            && request_body.installed) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_troubleshoot_config = db.get().collection('edge_troubleshoot_config');
                                let message;
                                if (request_body.installed == true) {
                                    message = "Troubleshoot config enabled successfully";
                                }
                                else {
                                    message = "Troubleshoot config disabled successfully";
                                }
                                edge_troubleshoot_config.find({
                                    customer_id: new ObjectId(request_body.customer_id)
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
                                            const troubleshootConfigValue = success[0];
                                            troubleshootConfigValue.installed = request_body.installed;
                                            edge_troubleshoot_config.update({
                                                _id: new ObjectId(success[0]._id)
                                            }, {
                                                $set: troubleshootConfigValue
                                            }, {
                                                upsert: true
                                            }, function (err2, success1) {
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
                                                            message: message
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
                                                    message: "Troubleshoot config not installed"
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
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id and installed value are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
}
exports.EdgeDeviceConfigEnableDisableController = EdgeDeviceConfigEnableDisableController;
//# sourceMappingURL=EdgeDeviceConfigEnableDisableController.js.map