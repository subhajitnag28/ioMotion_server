"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ImageUploadController_1 = require("../controllers/ImageUploadController");
class ImageUploadRoutes {
    constructor() {
        this.imageUploadController = new ImageUploadController_1.ImageUploadController();
    }
    routes(app) {
        // Admin image upload
        app.route('/admin-image-upload').post(this.imageUploadController.uploadAdminImage);
    }
}
exports.ImageUploadRoutes = ImageUploadRoutes;
//# sourceMappingURL=ImageUploadRoutes.js.map