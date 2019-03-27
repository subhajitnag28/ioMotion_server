import * as express from "express";
import * as bodyParser from "body-parser";
import * as  cors from 'cors';
import * as  morgan from 'morgan';
import * as  multer from 'multer';
import { AdminRoutes } from "./routes/AdminRoutes";
import { UserRoutes } from './routes/UserRoutes';
import { ImageUploadRoutes } from './routes/ImageUploadRoutes';
import { MicroservicesRoutes } from './routes/MicroservicesRoutes';
import { EdgeDeviceConfigRoutes } from './routes/EdgeDeviceConfigRoutes';
import db = require('./database');

class App {

    public app: express.Application;
    public adminRoutes: AdminRoutes = new AdminRoutes();
    public userRoutes: UserRoutes = new UserRoutes();
    public imageUploadRoutes: ImageUploadRoutes = new ImageUploadRoutes();
    public microservicesRoutes: MicroservicesRoutes = new MicroservicesRoutes();
    public edgeDeviceConfigRoutes: EdgeDeviceConfigRoutes = new EdgeDeviceConfigRoutes();
    public dev_uri: string = 'mongodb://localhost:27017/ioMotion_Server';
    public prod_uri: string = 'mongodb://ioMotion:ioMotion1234@ds121624.mlab.com:21624/iomotion';

    constructor() {
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

    private config(): void {
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

    private connect_database() {
        if (this.app.get('env') == "development") {
            db.connect(this.dev_uri);
        } else {
            db.connect(this.prod_uri);
        }
    }

    /**
     * Create image upload path
     */
    private createImageUploadPath() {
        multer({ dest: 'dist/uploadImage/' });
    }

    /**
     * Create microservices path
     */
    private createMicroservicesPath() {
        multer({ dest: 'dist/microservicesImage/' });
    }
}

export default new App().app;