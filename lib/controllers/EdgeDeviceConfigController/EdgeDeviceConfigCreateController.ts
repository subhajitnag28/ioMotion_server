import { Request, Response } from 'express';
import * as mongodb from 'mongodb';
import * as jwt from 'jsonwebtoken';
import db = require('../../database');
import sp = require('../../salt_password');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const ObjectId = mongodb.ObjectID;

export class EdgeDeviceConfigCreateController {

    /**
	 * Install controller config
	 */
    public installControllerConfig(req: Request, res: Response) {
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
                            request_body.customer_id &&
                            request_body.installed) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                deviceName: Joi.string().alphanum().min(5).max(15).label('Device name should be within 5 to 15 alphanumeric character long').required().trim().replace(/ /g, ''),
                                locationName: Joi.string().min(10).max(200).label("Location should be within 10 to 200 character long").required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required || Please provide customer id correctly'),
                                installed: Joi.boolean().label('installed is required')
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
                                    data.customer_id = new ObjectId(data.customer_id);
                                    const edge_device_config = db.get().collection('edge_device_config');
                                    edge_device_config.find({
                                        customer_id: data.customer_id,
                                        installed: data.installed
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
                                                res.status(403).json({
                                                    success: false,
                                                    data: {
                                                        status: 403,
                                                        message: "Controller config already installed"
                                                    }
                                                });
                                            } else {
                                                edge_device_config.save(data, function (err2: any, success1: any) {
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
                                                                message: "Controller config installed successfully"
                                                            }
                                                        });
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
                                    message: "Device Id, Device name, Location, Customer Id and installed are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Install wifi config
	 */
    public installWifiConfig(req: Request, res: Response) {
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
                            request_body.customer_id &&
                            request_body.installed) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                ssid: Joi.string().alphanum().min(5).max(32).label('SSID should be within 5 to 32 alphanumeric character long').required().trim().replace(/ /g, ''),
                                password: Joi.string().min(5).max(50).label("Password should be within 5 to 50 character long").required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required'),
                                installed: Joi.boolean().label('installed is required')
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
                                    data.customer_id = new ObjectId(data.customer_id);
                                    delete data.password;

                                    const edge_wifi_config = db.get().collection('edge_wifi_config');
                                    edge_wifi_config.find({
                                        customer_id: data.customer_id,
                                        installed: data.installed
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
                                                res.status(403).json({
                                                    success: false,
                                                    data: {
                                                        status: 403,
                                                        message: "Wifi config already installed"
                                                    }
                                                });
                                            } else {
                                                edge_wifi_config.save(data, function (err2: any, success1: any) {
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
                                                                message: "Wifi config installed successfully"
                                                            }
                                                        });
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
                                    message: "Device Id, SSID, Password, Customer Id and installed are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Install carrier config
	 */
    public installCarrierConfig(req: Request, res: Response) {
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
                            request_body.customer_id &&
                            request_body.installed) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                lteId: Joi.string().length(20).alphanum().label('LTE-ID must be 20 alphanumeric character long').required().trim().replace(/ /g, ''),
                                SecurityID: Joi.string().length(15).alphanum().label('Security Id must be 15 alphanumeric character long').required().trim().replace(/ /g, ''),
                                misc: Joi.string().length(15).alphanum().label('Misc must be 15 alphanumeric character long').required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required'),
                                installed: Joi.boolean().label('installed is required')
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
                                    data.customer_id = new ObjectId(data.customer_id);
                                    const edge_carrier_config = db.get().collection('edge_carrier_config');

                                    edge_carrier_config.find({
                                        customer_id: data.customer_id,
                                        installed: data.installed
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
                                                res.status(403).json({
                                                    success: false,
                                                    data: {
                                                        status: 403,
                                                        message: "Carrier config already installed"
                                                    }
                                                });
                                            } else {
                                                edge_carrier_config.save(data, function (err2: any, success1: any) {
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
                                                                message: "Carrier config installed successfully"
                                                            }
                                                        });
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
                                    message: "Device Id, LTE-ID, Security Id, Misc, Customer Id and installed are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Install Ble config
	 */
    public installBleConfig(req: Request, res: Response) {
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
                            request_body.customer_id &&
                            request_body.installed) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                uuid: Joi.string().uuid().label('UUID be 16 character long').required().trim().replace(/ /g, ''),
                                majorNumber: Joi.string().min(0).max(65535).label('Major number should be within 0 to 65535 character long').required().trim().replace(/ /g, ''),
                                minorNumber: Joi.string().min(0).max(65535).label('Minor number should be within 0 to 65535 character long').required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required'),
                                installed: Joi.boolean().label('installed is required')
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
                                    data.customer_id = new ObjectId(data.customer_id);
                                    const edge_ble_config = db.get().collection('edge_ble_config');

                                    edge_ble_config.find({
                                        customer_id: data.customer_id,
                                        installed: data.installed
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
                                                res.status(403).json({
                                                    success: false,
                                                    data: {
                                                        status: 403,
                                                        message: "Ble config already installed"
                                                    }
                                                });
                                            } else {
                                                edge_ble_config.save(data, function (err2: any, success1: any) {
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
                                                                message: "Ble config installed successfully"
                                                            }
                                                        });
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
                                    message: "Device Id, UUID, Major number, Minor number, Customer Id and installed are required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
	 * Install Troubleshoot config
	 */
    public installTroubleshootConfig(req: Request, res: Response) {
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
                            request_body.customer_id &&
                            request_body.installed) {
                            const schema = Joi.object().keys({
                                deviceId: Joi.string().length(15).hex().label('Device Id must be 15 hexadecimal number').required().trim().replace(/ /g, ''),
                                customer_id: Joi.objectId().label('Customer Id is required'),
                                installed: Joi.boolean().label('installed is required')
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
                                    data.customer_id = new ObjectId(data.customer_id);
                                    const edge_troubleshoot_config = db.get().collection('edge_troubleshoot_config');

                                    edge_troubleshoot_config.find({
                                        customer_id: data.customer_id,
                                        installed: data.installed
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
                                                res.status(403).json({
                                                    success: false,
                                                    data: {
                                                        status: 403,
                                                        message: "Troubleshoot config already installed"
                                                    }
                                                });
                                            } else {
                                                edge_troubleshoot_config.save(data, function (err2: any, success1: any) {
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
                                                                message: "Troubleshoot config installed successfully"
                                                            }
                                                        });
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