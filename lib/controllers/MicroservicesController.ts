import { Request, Response } from 'express';
import * as  multer from 'multer';
import * as path from 'path';
import * as mongodb from 'mongodb';
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const ObjectId = mongodb.ObjectID;
import db = require('../database');

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        // if (this.app.get('env') == "development") {
        //     cb(null, './lib/microservicesImage')
        // } else {
        //     cb(null, './dist/microservicesImage')
        // }
        cb(null, './lib/microservicesImage')
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

export class MicroservicesController {

    /**
     * Add microservices
     */
    public addMicroservices(req: any, res: any) {
        var upload = multer({
            storage: storage,
            fileFilter: function (req: any, file: any, cb: any) {
                var ext = path.extname(file.originalname);
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                    return cb(null, false)
                }
                cb(null, true)
            }
        }).single('file');

        upload(req, res, function (error: any) {
            if (error) {
                res.status(500).json({
                    success: false,
                    data: {
                        message: error
                    }
                });
            } else {
                if (req.body.microserviceName &&
                    req.body.microserviceDescription &&
                    req.body.type &&
                    req.body.adminId) {
                    const schema = Joi.object().keys({
                        microserviceName: Joi.string().min(3).max(50).label('Microservice name should be within 3 to 50 character long').required().trim(),
                        microserviceDescription: Joi.string().min(2).max(500).label('Description should be within 2 to 500 character long').required().trim(),
                        type: Joi.string().min(7).max(9).label("Type should be within 7 to 9 character long").required().trim(),
                        adminId: Joi.objectId().label("Admin Id is required")
                    });

                    Joi.validate(req.body, schema, function (err: any, value: any) {
                        if (err) {
                            res.status(400).json({
                                success: false,
                                data: {
                                    message: err.details[0].context.label
                                }
                            });
                        } else {
                            const data = value;
                            const microservices = db.get().collection('microservices');

                            if (req.file.filename && data.adminId) {
                                data.image = req.file.filename;
                                data.adminId = new ObjectId(data.adminId);
                            }

                            microservices.save(data, function (err1: any, success1: any) {
                                if (err1) {
                                    res.status(500).json({
                                        success: false,
                                        data: err1
                                    });
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            message: "Microservice added successfully"
                                        }
                                    });
                                }
                            });

                        }
                    });
                } else {
                    res.status(403).json({
                        success: false,
                        data: {
                            message: "Microservice name, microservice description, type, admin Id, microservice image are required"
                        }
                    });
                }
            }
        });
    }

    /**
    * Get microservices on type
    */

    public getMicroservicesOnType(req: Request, res: Response) {
        const request_body = req.body;
        if (request_body.type) {
            const schema = Joi.object().keys({
                type: Joi.string().min(7).max(9).label("Type should be within 7 to 9 character long").required()
            });

            Joi.validate(request_body, schema, function (err: any, value: any) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                } else {
                    const data = value;
                    const microservices = db.get().collection('microservices');
                    microservices.find({
                        type: data.type
                    }).toArray(function (err1: any, docs: any) {
                        if (err1) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    message: err1
                                }
                            });
                        } else {
                            if (docs.length != 0) {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        data: docs
                                    }
                                });
                            } else {
                                res.status(404).json({
                                    success: false,
                                    data: {
                                        message: "Microservices not found"
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Type is required"
                }
            });
        }
    }

    /**
     * Install microservices
     */
    public installMicroservice(req: Request, res: Response) {
        const request_body = req.body;
        if (request_body.microserviceName &&
            request_body.microserviceDescription &&
            request_body.type &&
            request_body.image &&
            request_body.microserviceId &&
            request_body.userId) {
            const schema = Joi.object().keys({
                microserviceName: Joi.string().min(3).max(50).label('Microservice should be within 3 to 50 character long').required(),
                microserviceDescription: Joi.string().min(2).max(500).label('Description should be within 2 to 500 character long').required(),
                type: Joi.string().min(7).max(9).label("Type should be within 7 to 9 character long").required(),
                image: Joi.string().label("Image is required").required(),
                microserviceId: Joi.objectId().label("Microservice Id is required"),
                userId: Joi.objectId().label("User Id is required")
            });

            Joi.validate(request_body, schema, function (err: any, value: any) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                } else {
                    const data = value;
                    const installMicroservice = db.get().collection('installMicroservice');

                    if (data.userId && data.microserviceId) {
                        data.userId = new ObjectId(data.userId);
                        data.microserviceId = new ObjectId(data.microserviceId);
                    }

                    installMicroservice.save(data, function (err1: any, success1: any) {
                        if (err1) {
                            res.status(500).json({
                                success: false,
                                data: err1
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                data: {
                                    message: "Microservice installed successfully"
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Type is required"
                }
            });
        }
    }

    /**
     * Get installed microservices
     */

    public getInstalledMicroservices(req: Request, res: Response) {
        const request_body = req.body;
        if (request_body.userId && request_body.type) {
            const schema = Joi.object().keys({
                userId: Joi.objectId().label("User Id is required"),
                type: Joi.string().min(7).max(9).label("Type should be within 7 to 9 character long").required()
            });

            Joi.validate(request_body, schema, function (err: any, value: any) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                } else {
                    const data = value;
                    const installMicroservice = db.get().collection('installMicroservice');
                    installMicroservice.find({
                        type: data.type,
                        userId: new ObjectId(data.userId)
                    }).toArray(function (err1: any, docs: any) {
                        if (err1) {
                            res.status(500).json({
                                success: false,
                                data: {
                                    message: err1
                                }
                            });
                        } else {
                            if (docs.length != 0) {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        data: docs
                                    }
                                });
                            } else {
                                res.status(404).json({
                                    success: false,
                                    data: {
                                        message: "Install microservices not found"
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Type and User Id are required"
                }
            });
        }
    }

    /**
     * Get list of microservices added by admin with pagination
     */
    public getMicroservicesList(req: Request, res: Response) {
        const request_body = req.body;
        if (request_body.page && request_body.size) {
            const schema = Joi.object().keys({
                page: Joi.string().min(1).max(2).label("Page number should be maximum 2 character long").required(),
                size: Joi.string().min(1).max(2).label("Size should be maximum 2 character long").required()
            });

            Joi.validate(request_body, schema, function (err: any, value: any) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                } else {
                    const data = value;
                    const microservices = db.get().collection('microservices');

                    microservices.find({})
                        .toArray(function (err1: any, success: any) {
                            if (err1) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        message: err1
                                    }
                                });
                            } else {
                                const pageNo = parseInt(data.page);
                                const size = parseInt(data.size);
                                if (pageNo < 0 || pageNo === 0) {
                                    res.status(403).json({
                                        success: false,
                                        data: "Please provide valid page no"
                                    });
                                } else {
                                    microservices.find({}, {}, { skip: size * (pageNo - 1), limit: size })
                                        .toArray(function (err2: any, success1: any) {
                                            if (err2) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: err2
                                                });
                                            } else {
                                                if (success1.length != 0) {
                                                    const microservicesList = success1;
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            details: microservicesList,
                                                            microservicesListCount: success.length
                                                        }
                                                    });
                                                } else {
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            details: [],
                                                            microservicesListCount: 0
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
        } else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Page number and size are required"
                }
            });
        }
    }

    /**
     * Update microservice
     */
    public updateMicroservice(req: Request, res: Response) {
        const request_body = req.body;
        if (request_body.microserviceId) {
            const isValid = ObjectId.isValid(request_body.microserviceId);
            if (isValid == true) {
                const microservices = db.get().collection('microservices');
                microservices.find({
                    _id: new ObjectId(request_body.microserviceId)
                }).toArray(function (err: any, success: any) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            data: err
                        });
                    } else {
                        if (success.length != 0) {
                            const microserviceDetails = success[0];
                            microserviceDetails.microserviceName = request_body.microserviceName ? request_body.microserviceName : success[0].microserviceName,
                                microserviceDetails.microserviceDescription = request_body.microserviceDescription ? request_body.microserviceDescription : success[0].microserviceDescription,
                                microserviceDetails.type = request_body.type ? request_body.type : success[0].type,
                                microserviceDetails.image = request_body.image ? request_body.image : success[0].image

                            microservices.update({
                                _id: new ObjectId(request_body.microserviceId)
                            }, {
                                    $set: microserviceDetails
                                }, {
                                    upsert: true
                                },
                                function (err1: any, success: any) {
                                    if (err1) {
                                        res.status(500).json({
                                            success: false,
                                            data: {
                                                message: err1
                                            }
                                        });
                                    } else {
                                        res.status(200).json({
                                            success: true,
                                            data: {
                                                message: "Microservice updated successfully"
                                            }
                                        });
                                    }
                                });
                        } else {
                            res.status(404).json({
                                success: false,
                                data: {
                                    message: "Microservice not found"
                                }
                            });
                        }
                    }
                });
            } else {
                res.status(403).json({
                    success: false,
                    data: {
                        message: "Microservice Id should be an object Id"
                    }
                });
            }
        } else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Microservice Id is required"
                }
            });
        }
    }

    /**
     * Search microservices list
     */
    public searchMicroservices(req: Request, res: Response) {
        const request_body = req.body;
        if (request_body.microserviceName && request_body.page && request_body.size && request_body.type) {
            const schema = Joi.object().keys({
                microserviceName: Joi.string().min(1).max(50).label('Microservice name should be within 1 to 50 character long').required().trim(),
                page: Joi.string().min(1).max(2).label("Page number should be maximum 2 character long").required(),
                size: Joi.string().min(1).max(2).label("Size should be maximum 2 character long").required(),
                type: Joi.string().min(7).max(9).label("Type should be within 7 to 9 character long").required().trim(),
            });

            Joi.validate(request_body, schema, function (err: any, value: any) {
                if (err) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: err.details[0].context.label
                        }
                    });
                } else {
                    let query = <any>{};
                    const data = value;
                    const microservices = db.get().collection('microservices');

                    microservices.find({})
                        .toArray(function (err1: any, success: any) {
                            if (err1) {
                                res.status(500).json({
                                    success: false,
                                    data: err1
                                });
                            } else {
                                const pageNo = parseInt(data.page);
                                const size = parseInt(data.size);
                                if (pageNo < 0 || pageNo === 0) {
                                    res.status(403).json({
                                        success: false,
                                        data: "Please provide valid page no"
                                    });
                                } else {
                                    if (data.microserviceName) {
                                        const x = [data.microserviceName],
                                            regex = x.map(function (e) {
                                                return new RegExp(e, "i");
                                            });
                                        query["microserviceName"] = {
                                            $in: regex
                                        }
                                    }
                                    if (data.type) {
                                        query.type = data.type
                                    }
                                    microservices.find(query, {}, { skip: size * (pageNo - 1), limit: size })
                                        .toArray(function (err2: any, success1: any) {
                                            if (err2) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: err2
                                                });
                                            } else {
                                                if (success1.length != 0) {
                                                    const microservicesList = success1;
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            details: microservicesList,
                                                            microservicesListCount: success.length
                                                        }
                                                    });
                                                } else {
                                                    res.status(200).json({
                                                        success: false,
                                                        data: {
                                                            details: [],
                                                            message: "Microservices not found"
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
        } else {
            res.status(403).json({
                success: false,
                data: {
                    message: "Microservice name, type, page and size are required"
                }
            });
        }
    }
}