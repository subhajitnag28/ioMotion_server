"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const db = require("../../database");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const ObjectId = mongodb.ObjectID;
class EdgeDeviceConfigGetController {
    /**
     * Get controller config
     */
    getControllerConfig(req, res) {
        const request_body = req.param('id');
        if (request_body) {
            console.log(request_body);
            const edge_device_config = db.get().collection('edge_device_config');
            edge_device_config.find({
                customer_id: new ObjectId(request_body)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        res.status(200).json({
                            success: true,
                            data: {
                                details: success[0]
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "Controller config not found"
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
                    message: "Customer Id is required"
                }
            });
        }
    }
    /**
     * Get wifi config
     */
    getWifiConfig(req, res) {
        const request_body = req.param('id');
        if (request_body) {
            const edge_wifi_config = db.get().collection('edge_wifi_config');
            edge_wifi_config.find({
                customer_id: new ObjectId(request_body)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        res.status(200).json({
                            success: true,
                            data: {
                                details: success[0]
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "Wifi config not found"
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
                    message: "Customer Id is required"
                }
            });
        }
    }
    /**
     * Get carrier config
     */
    getCarrierConfig(req, res) {
        const request_body = req.param('id');
        if (request_body) {
            const edge_carrier_config = db.get().collection('edge_carrier_config');
            edge_carrier_config.find({
                customer_id: new ObjectId(request_body)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        res.status(200).json({
                            success: true,
                            data: {
                                details: success[0]
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "Carrier config not found"
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
                    message: "Customer Id is required"
                }
            });
        }
    }
    /**
    * Get Ble config
    */
    getBleConfig(req, res) {
        const request_body = req.param('id');
        if (request_body) {
            const edge_ble_config = db.get().collection('edge_ble_config');
            edge_ble_config.find({
                customer_id: new ObjectId(request_body)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        res.status(200).json({
                            success: true,
                            data: {
                                details: success[0]
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "Ble config not found"
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
                    message: "Customer Id is required"
                }
            });
        }
    }
    /**
     * Get troubleshoot config
     */
    getTroubleshootConfig(req, res) {
        const request_body = req.param('id');
        if (request_body) {
            const edge_troubleshoot_config = db.get().collection('edge_troubleshoot_config');
            edge_troubleshoot_config.find({
                customer_id: new ObjectId(request_body)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                }
                else {
                    if (success.length != 0) {
                        res.status(200).json({
                            success: true,
                            data: {
                                details: success[0]
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            success: false,
                            data: {
                                message: "Troubleshoot config not found"
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
                    message: "Customer Id is required"
                }
            });
        }
    }
}
exports.EdgeDeviceConfigGetController = EdgeDeviceConfigGetController;
//# sourceMappingURL=EdgeDeviceConfigGetController.js.map