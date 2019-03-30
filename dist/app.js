"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const AdminRoutes_1 = require("./routes/AdminRoutes");
const UserRoutes_1 = require("./routes/UserRoutes");
const ImageUploadRoutes_1 = require("./routes/ImageUploadRoutes");
const MicroservicesRoutes_1 = require("./routes/MicroservicesRoutes");
const EdgeDeviceConfigRoutes_1 = require("./routes/EdgeDeviceConfigRoutes");
const db = require("./database");
class App {
    constructor() {
        this.adminRoutes = new AdminRoutes_1.AdminRoutes();
        this.userRoutes = new UserRoutes_1.UserRoutes();
        this.imageUploadRoutes = new ImageUploadRoutes_1.ImageUploadRoutes();
        this.microservicesRoutes = new MicroservicesRoutes_1.MicroservicesRoutes();
        this.edgeDeviceConfigRoutes = new EdgeDeviceConfigRoutes_1.EdgeDeviceConfigRoutes();
        this.dev_uri = 'mongodb://localhost:27017/ioMotion_Server';
        this.prod_uri = '';
        this.app = express();
        this.config();
        this.adminRoutes.routes(this.app);
        this.userRoutes.routes(this.app);
        this.imageUploadRoutes.routes(this.app);
        this.microservicesRoutes.routes(this.app);
        this.edgeDeviceConfigRoutes.routes(this.app);
        this.connect_database();
        this.createImageUploadPath();
        this.createMicroservicesPath();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(morgan('tiny'));
        // serving static files 
        this.app.use(express.static('public'));
        this.app.use('/image', express.static(__dirname + '/uploadImage'));
        this.app.use('/microservice-image', express.static(__dirname + '/microservicesImage'));
    }
    /**
     * Connect with db
     */
    connect_database() {
        if (this.app.get('env') == "development") {
            db.connect(this.dev_uri);
        }
        else {
            db.connect(this.prod_uri);
        }
    }
    /**
     * Create image upload path
     */
    createImageUploadPath() {
        multer({ dest: 'lib/uploadImage/' });
    }
    /**
     * Create microservices path
     */
    createMicroservicesPath() {
        multer({ dest: 'lib/microservicesImage/' });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map