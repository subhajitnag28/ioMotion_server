import { MicroservicesController } from "../controllers/MicroservicesController";

export class MicroservicesRoutes {

    public microservicesController: MicroservicesController = new MicroservicesController();

    public routes(app: any): void {

        /**
         * Add microservices by admin
         * type: Post,
         * parameters:{
         *  microserviceName: within 3 to 50 character,
         *  microserviceDescription: within 2 to 500,
         *  type: available/install/roadmap,
         *  adminId: ObjectId,
         *  image: Image filename, example file-1552223230074.jpg, extension .jpg, .jpeg, .png
         * }
         */
        app.route('/admin/add-microservices').post(this.microservicesController.addMicroservices);

        /**
         * Get microservices on type
         * type: available/roadmap
         */
        app.route('/getMicroservicesOnType').post(this.microservicesController.getMicroservicesOnType);

        /**
         * Install microservices
         * type: Post,
         * parameters:{
         *  microserviceName: within 3 to 50 character,
         *  microserviceDescription: within 2 to 500,
         *  type: available,
         *  image: Image filename, example file-1552223230074.jpg, extension .jpg, .jpeg, .png,
         *  microserviceId: ObjectId,
         *  userId: ObjectId
         * }
         */
        app.route('/installMicroservice').post(this.microservicesController.installMicroservice);

        /**
         * Get installed microservices
         * type: Post,
         * parameters:{
         *  userId: ObjectId,
         *  type: install
         * }
         */
        app.route('/getInstalledMicroservices').post(this.microservicesController.getInstalledMicroservices);

        /**
         * Get list of microservices added by admin with pagination
         * type: Post,
         * parameters:{
         *  page: maximum 2 character, default value 1
         *  size: maximum 2 character, default value 10
         * }
         */
        app.route('/getMicroservicesList').post(this.microservicesController.getMicroservicesList);

        /**
         * Update microservice
         * type: Post,
         * parameters:{
         *  microserviceId: ObjectId
         * }
         */
        app.route('/updateMicroservice').post(this.microservicesController.updateMicroservice);

        /**
         * Search microservices list
         * type: Post,
         * parameters:{
         *  microserviceName: within 1 to 50 character,
         *  type: available/install/roadmap,
         *  page: maximum 2 character, default value 1,
         *  size: maximum 2 character, default value 10
         * }
         */
        app.route('/searchMicroservices').post(this.microservicesController.searchMicroservices);
    }
}