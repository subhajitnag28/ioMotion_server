"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MicroservicesController_1 = require("../controllers/MicroservicesController");
class MicroservicesRoutes {
    constructor() {
        this.microservicesController = new MicroservicesController_1.MicroservicesController();
    }
    routes(app) {
        /**
         * Add microservices by admin
         * type: Post,
         * parameters:{
         *  microserviceName: within 3 to 50 character,
         *  microserviceDescription: within 2 to 500,
         *  type: available/roadmap,
         *  adminId: ObjectId,
         *  image: Image filename, example file-1552223230074.jpg, extension .jpg, .jpeg, .png
         * }
         */
        app.route('/admin/add-microservices').post(this.microservicesController.addMicroservices);
        /**
         * Get microservices on type
         * type: available/roadmap
         */
        app.route('/get-microservices-on-type').post(this.microservicesController.getMicroservicesOnType);
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
        app.route('/install-microservice').post(this.microservicesController.installMicroservice);
        /**
         * Get installed microservices
         * type: Post,
         * parameters:{
         *  userId: ObjectId,
         *  type: install
         * }
         */
        app.route('/get-installed-microservices').post(this.microservicesController.getInstalledMicroservices);
        /**
         * Get list of microservices added by admin with pagination
         * type: Post,
         * parameters:{
         *  page: maximum 2 character, default value 1
         *  size: maximum 2 character, default value 10
         * }
         */
        app.route('/get-microservices-list').post(this.microservicesController.getMicroservicesList);
        /**
         * Update microservice details
         * type: Post,
         * parameters:{
         *  microserviceId: ObjectId
         * }
         */
        app.route('/update-microservice-details').post(this.microservicesController.updateMicroserviceDetails);
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
        app.route('/search-microservices').post(this.microservicesController.searchMicroservices);
    }
}
exports.MicroservicesRoutes = MicroservicesRoutes;
//# sourceMappingURL=MicroservicesRoutes.js.map