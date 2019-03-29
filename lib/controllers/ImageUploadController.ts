import * as mongodb from 'mongodb';
import * as  multer from 'multer';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import db = require('../database');

const ObjectId = mongodb.ObjectID;

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, './dist/uploadImage')
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

export class ImageUploadController {

	/**
	 * Admin image upload
	 */
    public uploadAdminImage(req: any, res: any) {
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
                jwt.verify(token, 'ioMotionAdmin', function (err: any, decoded: any) {
                    if (err) {
                        if (err.name == "TokenExpiredError") {
                            res.status(401).json({
                                success: false,
                                data: {
                                    status: 401,
                                    message: 'Unauthorized'
                                }
                            });
                        } else if (err.name == "JsonWebTokenError") {
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
                        const tokenRes = decoded;
                        let image: any;
                        const admin = db.get().collection('admin');

                        var upload = multer({
                            storage: storage,
                            fileFilter: function (req1, file, cb) {
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
                                        status: 500,
                                        message: 'Server error'
                                    }
                                });
                            }
                            else if (req.file) {
                                image = req.file;

                                if (image) {
                                    admin.update({
                                        _id: new ObjectId(tokenRes.adminId)
                                    }, {
                                            $set: { imageFileName: image.filename }
                                        }, {
                                            upsert: true
                                        },
                                        function (err2: any, res2: any) {
                                            if (err2) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: {
                                                        status: 500,
                                                        message: 'Server error'
                                                    }
                                                })
                                            } else {
                                                res.status(200).json({
                                                    success: true,
                                                    data: {
                                                        status: 200,
                                                        filename: image.filename,
                                                        message: "Image upload successfully."
                                                    }
                                                });
                                            }
                                        });
                                }
                            } else {
                                res.status(400).json({
                                    success: false,
                                    data: {
                                        status: 400,
                                        message: "Please select an image first"
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    }
}