import { Request, Response } from 'express';
import * as mongodb from 'mongodb';
import * as jwt from 'jsonwebtoken';
import db = require('../../database');
import sp = require('../../salt_password');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const ObjectId = mongodb.ObjectID;

export class EdgeDeviceConfigUpdateController {

    /**
	 * Update controller config
	 */
    public updateControllerConfig(req: Request, res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        } else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr: any, decoded: any) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else if (jwtErr.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    } else {
                        const request_body = req.body;
                        if (request_body.deviceId &&
                            request_body.deviceName &&
                            request_body.locationName &&
                            request_body.customer_id) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                deviceName: Joi.string().alphanum().min(5).max(15).label('Device name should be within 5 to 15 alphanumeric character long').required().trim().replace(/ /g, ''),
                                locationName: Joi.string().min(10).max(200).label("Location should be within 10 to 200 character long").required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required')
                            });

                            Joi.validate(request_body, schema, function (err: any, value: any) {
                                if (err) {
                                    res.status(400).json({
                                        success: false,
                                        data: {
                                            status: 400,
                                            message: err.details[0].context.label
                                        }
                                    });
                                } else {
                                    const data = value;
                                    const edge_device_config = db.get().collection('edge_device_config');
                                    edge_device_config.find({
                                        customer_id: new ObjectId(data.customer_id)
                                    }).toArray(function (err1: any, success: any) {
                                        if (err1) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        } else {
                                            if (success.length != 0) {
                                                const deviceConfigValue = success[0];
                                                deviceConfigValue.deviceId = data.deviceId;
                                                deviceConfigValue.deviceName = data.deviceName;
                                                deviceConfigValue.locationName = data.locationName;
                                                edge_device_config.update({
                                                    _id: new ObjectId(success[0]._id)
                                                }, {
                                                        $set: deviceConfigValue
                                                    }, {
                                                        upsert: true
                                                    },
                                                    function (err2: any, success1: any) {
                                                        if (err2) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        } else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Controller config updated successfully"
                                                                }
                                                            });
                                                        }
                                                    });
                                            } else {
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
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Device Id, Device name, Location and Customer Id are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Update wifi config
	 */
    public updateWifiConfig(req: Request, res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        } else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr: any, decoded: any) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else if (jwtErr.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    } else {
                        const request_body = req.body;
                        if (request_body.deviceId &&
                            request_body.ssid &&
                            request_body.password &&
                            request_body.customer_id) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                ssid: Joi.string().alphanum().min(5).max(32).label('SSID should be within 5 to 32 alphanumeric character long').required().trim().replace(/ /g, ''),
                                password: Joi.string().min(5).max(50).label("Password should be within 5 to 50 character long").required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required')
                            });

                            Joi.validate(request_body, schema, function (err: any, value: any) {
                                if (err) {
                                    res.status(400).json({
                                        success: false,
                                        data: {
                                            status: 400,
                                            message: err.details[0].context.label
                                        }
                                    });
                                } else {
                                    const data = value;
                                    const saltedPassword = sp.saltHashPassword(data.password);
                                    data.saltKey = saltedPassword.salt;
                                    data.salt = saltedPassword.passwordHash;
                                    delete data.password;

                                    const edge_wifi_config = db.get().collection('edge_wifi_config');
                                    edge_wifi_config.find({
                                        customer_id: new ObjectId(data.customer_id)
                                    }).toArray(function (err1: any, success: any) {
                                        if (err1) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        } else {
                                            if (success.length != 0) {
                                                const wifiConfigValue = success[0];
                                                wifiConfigValue.deviceId = data.deviceId;
                                                wifiConfigValue.ssid = data.ssid;
                                                wifiConfigValue.saltKey = data.saltKey;
                                                wifiConfigValue.salt = data.salt;
                                                edge_wifi_config.update({
                                                    _id: new ObjectId(success[0]._id)
                                                }, {
                                                        $set: wifiConfigValue
                                                    }, {
                                                        upsert: true
                                                    },
                                                    function (err2: any, success1: any) {
                                                        if (err2) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        } else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Wifi config updated successfully"
                                                                }
                                                            });
                                                        }
                                                    });
                                            } else {
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
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Device Id, SSID, Password and Customer Id are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Update carrier config
	 */
    public updateCarrierConfig(req: Request, res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        } else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr: any, decoded: any) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else if (jwtErr.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    } else {
                        const request_body = req.body;
                        if (request_body.deviceId &&
                            request_body.lteId &&
                            request_body.SecurityID &&
                            request_body.misc &&
                            request_body.customer_id) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                lteId: Joi.string().length(20).alphanum().label('LTE-ID must be 20 alphanumeric character long').required().trim().replace(/ /g, ''),
                                SecurityID: Joi.string().length(15).alphanum().label('Security Id must be 15 alphanumeric character long').required().trim().replace(/ /g, ''),
                                misc: Joi.string().length(15).alphanum().label('Misc must be 15 alphanumeric character long').required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required')
                            });

                            Joi.validate(request_body, schema, function (err: any, value: any) {
                                if (err) {
                                    res.status(400).json({
                                        success: false,
                                        data: {
                                            status: 400,
                                            message: err.details[0].context.label
                                        }
                                    });
                                } else {
                                    const data = value;
                                    const edge_carrier_config = db.get().collection('edge_carrier_config');

                                    edge_carrier_config.find({
                                        customer_id: new ObjectId(data.customer_id)
                                    }).toArray(function (err1: any, success: any) {
                                        if (err1) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        } else {
                                            if (success.length != 0) {
                                                const carrierConfigValue = success[0];
                                                carrierConfigValue.deviceId = data.deviceId;
                                                carrierConfigValue.lteId = data.lteId;
                                                carrierConfigValue.SecurityID = data.SecurityID;
                                                carrierConfigValue.misc = data.misc;
                                                edge_carrier_config.update({
                                                    _id: new ObjectId(success[0]._id)
                                                }, {
                                                        $set: carrierConfigValue
                                                    }, {
                                                        upsert: true
                                                    },
                                                    function (err2: any, success1: any) {
                                                        if (err2) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        } else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Carrier config updated successfully"
                                                                }
                                                            });
                                                        }
                                                    });
                                            } else {
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
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Device Id, LTE-ID, Security Id, Misc and Customer Id are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Update Ble config
	 */
    public updateBleConfig(req: Request, res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        } else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr: any, decoded: any) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else if (jwtErr.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    } else {
                        const request_body = req.body;
                        if (request_body.deviceId &&
                            request_body.uuid &&
                            request_body.majorNumber &&
                            request_body.minorNumber &&
                            request_body.customer_id) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                uuid: Joi.string().uuid().label('UUID be 16 character long').required().trim().replace(/ /g, ''),
                                majorNumber: Joi.string().min(0).max(65535).label('Major number should be within 0 to 65535 character long').required().trim().replace(/ /g, ''),
                                minorNumber: Joi.string().min(0).max(65535).label('Minor number should be within 0 to 65535 character long').required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required')
                            });

                            Joi.validate(request_body, schema, function (err: any, value: any) {
                                if (err) {
                                    res.status(400).json({
                                        success: false,
                                        data: {
                                            status: 400,
                                            message: err.details[0].context.label
                                        }
                                    });
                                } else {
                                    const data = value;
                                    const edge_ble_config = db.get().collection('edge_ble_config');

                                    edge_ble_config.find({
                                        customer_id: new ObjectId(data.customer_id)
                                    }).toArray(function (err1: any, success: any) {
                                        if (err1) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        } else {
                                            if (success.length != 0) {
                                                const bleConfigValue = success[0];
                                                bleConfigValue.deviceId = data.deviceId;
                                                bleConfigValue.uuid = data.uuid;
                                                bleConfigValue.majorNumber = data.majorNumber;
                                                bleConfigValue.minorNumber = data.minorNumber;
                                                edge_ble_config.update({
                                                    _id: new ObjectId(success[0]._id)
                                                }, {
                                                        $set: bleConfigValue
                                                    }, {
                                                        upsert: true
                                                    },
                                                    function (err2: any, success1: any) {
                                                        if (err2) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        } else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Ble config updated successfully"
                                                                }
                                                            });
                                                        }
                                                    });
                                            } else {
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
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Device Id, UUID, Major number, Minor number and Customer Id are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Update Troubleshoot config
	 */
    public updateTroubleshootConfig(req: Request, res: Response) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({
                success: false,
                data: {
                    status: 403,
                    message: 'Authorization token not provided'
                }
            });
        } else {
            if (token != 'null') {
                jwt.verify(token, 'ioMotionAdmin', function (jwtErr: any, decoded: any) {
                    if (jwtErr) {
                        if (jwtErr.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else if (jwtErr.name == "JsonWebTokenError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                data: {
                                    status: 500,
                                    message: 'Server error'
                                }
                            });
                        }
                    } else {
                        const request_body = req.body;
                        if (request_body.deviceId &&
                            request_body.customer_id) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required')
                            });

                            Joi.validate(request_body, schema, function (err: any, value: any) {
                                if (err) {
                                    res.status(400).json({
                                        success: false,
                                        data: {
                                            status: 400,
                                            message: err.details[0].context.label
                                        }
                                    });
                                } else {
                                    const data = value;
                                    const edge_troubleshoot_config = db.get().collection('edge_troubleshoot_config');

                                    edge_troubleshoot_config.find({
                                        customer_id: new ObjectId(data.customer_id)
                                    }).toArray(function (err1: any, success: any) {
                                        if (err1) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    status: 500,
                                                    message: 'Server error'
                                                }
                                            });
                                        } else {
                                            if (success.length != 0) {
                                                const troubleshootConfigValue = success[0];
                                                troubleshootConfigValue.deviceId = data.deviceId;
                                                edge_troubleshoot_config.update({
                                                    _id: new ObjectId(success[0]._id)
                                                }, {
                                                        $set: troubleshootConfigValue
                                                    }, {
                                                        upsert: true
                                                    },
                                                    function (err2: any, success1: any) {
                                                        if (err2) {
                                                            res.status(500).json({
                                                                success: false,
                                                                data: {
                                                                    status: 500,
                                                                    message: 'Server error'
                                                                }
                                                            });
                                                        } else {
                                                            res.status(200).json({
                                                                success: true,
                                                                data: {
                                                                    status: 200,
                                                                    message: "Troubleshoot config updated successfully"
                                                                }
                                                            });
                                                        }
                                                    });
                                            } else {
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
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Device Id and Customer Id are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
}