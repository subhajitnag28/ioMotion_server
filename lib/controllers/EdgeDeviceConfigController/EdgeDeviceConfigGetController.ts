import { Request, Response } from 'express';
import * as mongodb from 'mongodb';
import * as jwt from 'jsonwebtoken';
import db = require('../../database');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const ObjectId = mongodb.ObjectID;

export class EdgeDeviceConfigGetController {

    /**
     * Get controller config
     */
    public getControllerConfig(req: Request, res: Response) {
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
                        if (request_body.customerId) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_device_config = db.get().collection('edge_device_config');
                                edge_device_config.find({
                                    customer_id: new ObjectId(request_body.customerId)
                                }).toArray(function (err: any, success: any) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    } else {
                                        if (success.length != 0) {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    status: 200,
                                                    details: success[0]
                                                }
                                            });
                                        } else {
                                            res.status(404).json({
                                                success: false,
                                                data: {
                                                    status: 404,
                                                    message: "Controller config not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id is required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
     * Get wifi config
     */
    public getWifiConfig(req: Request, res: Response) {
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
                        if (request_body.customerId) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_wifi_config = db.get().collection('edge_wifi_config');
                                edge_wifi_config.find({
                                    customer_id: new ObjectId(request_body.customerId)
                                }).toArray(function (err: any, success: any) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    } else {
                                        if (success.length != 0) {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    status: 200,
                                                    details: success[0]
                                                }
                                            });
                                        } else {
                                            res.status(404).json({
                                                success: false,
                                                data: {
                                                    status: 404,
                                                    message: "Wifi config not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id is required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
     * Get carrier config
     */
    public getCarrierConfig(req: Request, res: Response) {
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
                        if (request_body.customerId) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_carrier_config = db.get().collection('edge_carrier_config');
                                edge_carrier_config.find({
                                    customer_id: new ObjectId(request_body.customerId)
                                }).toArray(function (err: any, success: any) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    } else {
                                        if (success.length != 0) {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    status: 200,
                                                    details: success[0]
                                                }
                                            });
                                        } else {
                                            res.status(404).json({
                                                success: false,
                                                data: {
                                                    status: 404,
                                                    message: "Carrier config not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer id is required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
    * Get Ble config
    */
    public getBleConfig(req: Request, res: Response) {
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
                        if (request_body.customerId) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_ble_config = db.get().collection('edge_ble_config');
                                edge_ble_config.find({
                                    customer_id: new ObjectId(request_body.customerId)
                                }).toArray(function (err: any, success: any) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    } else {
                                        if (success.length != 0) {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    status: 200,
                                                    details: success[0]
                                                }
                                            });
                                        } else {
                                            res.status(404).json({
                                                success: false,
                                                data: {
                                                    status: 404,
                                                    message: "Ble config not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer Id is required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
     * Get troubleshoot config
     */
    public getTroubleshootConfig(req: Request, res: Response) {
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
                        if (request_body.customerId) {
                            const isValid = ObjectId.isValid(request_body.customerId);
                            if (isValid == true) {
                                const edge_troubleshoot_config = db.get().collection('edge_troubleshoot_config');
                                edge_troubleshoot_config.find({
                                    customer_id: new ObjectId(request_body.customerId)
                                }).toArray(function (err: any, success: any) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                status: 500,
                                                message: 'Server error'
                                            }
                                        });
                                    } else {
                                        if (success.length != 0) {
                                            res.status(200).json({
                                                success: true,
                                                data: {
                                                    status: 200,
                                                    details: success[0]
                                                }
                                            });
                                        } else {
                                            res.status(404).json({
                                                success: false,
                                                data: {
                                                    status: 404,
                                                    message: "Troubleshoot config not found"
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(403).json({
                                    success: false,
                                    data: {
                                        status: 403,
                                        message: "Please provide customer id correctly"
                                    }
                                });
                            }
                        } else {
                            res.status(400).json({
                                success: false,
                                data: {
                                    status: 400,
                                    message: "Customer Id is required"
                                }
                            });
                        }
                    }
                });
            }
        }
    }
}