import { ImageUploadController } from "../controllers/ImageUploadController";

export class ImageUploadRoutes {

    public imageUploadController: ImageUploadController = new ImageUploadController();

    public routes(app: any): void {

        // Admin image upload
        app.route('/admin-image-upload').post(this.imageUploadController.uploadAdminImage);
    }
}