"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const db = require("../database");
const ObjectId = mongodb.ObjectID;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './dist/uploadImage');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
class ImageUploadController {
    /**
     * Admin image upload
     */
    uploadAdminImage(req, res) {
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
                        let image;
                        const admin = db.get().collection('admin');
                        var upload = multer({
                            storage: storage,
                            fileFilter: function (req1, file, cb) {
                                var ext = path.extname(file.originalname);
                                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                                    return cb(null, false);
                                }
                                cb(null, true);
                            }
                        }).single('file');
                        upload(req, res, function (error) {
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
                                                    filename: image.filename,
                                                    message: "Image upload successfully."
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            else {
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
exports.ImageUploadController = ImageUploadController;
//# sourceMappingURL=ImageUploadController.js.map