"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EdgeDeviceConfigCreateController_1 = require("../controllers/EdgeDeviceConfigController/EdgeDeviceConfigCreateController");
const EdgeDeviceConfigUpdateController_1 = require("../controllers/EdgeDeviceConfigController/EdgeDeviceConfigUpdateController");
const EdgeDeviceConfigGetController_1 = require("../controllers/EdgeDeviceConfigController/EdgeDeviceConfigGetController");
class EdgeDeviceConfigRoutes {
    constructor() {
        this.edgeDeviceConfigCreateController = new EdgeDeviceConfigCreateController_1.EdgeDeviceConfigCreateController();
        this.edgeDeviceConfigUpdateController = new EdgeDeviceConfigUpdateController_1.EdgeDeviceConfigUpdateController();
        this.edgeDeviceConfigGetController = new EdgeDeviceConfigGetController_1.EdgeDeviceConfigGetController();
    }
    routes(app) {
        /**
         * Install controller config
         * type: Post
         * parameters: {
         *   deviceId: 15 HexaDecimal number,
         *   deviceName: within 5 to 15 alphanumeric,
         *   locationName: within 10 to 200 character,
         *   customer_id: ObjectId,
         *   isInstalled: true
         * }
         */
        app.route('/edge/devcon/installControllerConfig').post(this.edgeDeviceConfigCreateController.installControllerConfig);
        /**
         * Install wifi config
         * type: Post
         * parameters:{
         *   deviceId: 15 HexaDecimal number,
         *   ssid: within 5 to 32 alphanumeric,
         *   password: within 5 to 50 character,
         *   customer_id: ObjectId,
         *   isInstalled: true
         * }
         */
        app.route('/edge/devcon/installWifiConfig').post(this.edgeDeviceConfigCreateController.installWifiConfig);
        /**
         * Install carrier config
         * type: Post
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  lteId: 20 alphanumeric,
         *  SecurityID: 15 alphanumeric,
         *  misc: 15 alphanumeric,
         *  customer_id: ObjectId,
         *  isInstalled: true
         * }
         */
        app.route('/edge/devcon/installCarrierConfig').post(this.edgeDeviceConfigCreateController.installCarrierConfig);
        /**
         * Install Ble Config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  uuid: 16 byte with format, example xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
         *  majorNumber: within 0 to 65535
         *  minorNumber: within 0 to 65535,
         *  customer_id: ObjectId,
         *  isInstalled: true
         * }
         */
        app.route('/edge/devcon/installBleConfig').post(this.edgeDeviceConfigCreateController.installBleConfig);
        /**
         * Install troubleshoot config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  customer_id: ObjectId,
         *  isInstalled: true
         * }
         */
        app.route('/edge/devcon/installTroubleshootConfig').post(this.edgeDeviceConfigCreateController.installTroubleshootConfig);
        /**
        * Update controller config
        * type: Post
        * parameters: {
        *   deviceId: 15 HexaDecimal number,
        *   deviceName: within 5 to 15 alphanumeric,
        *   locationName: within 10 to 200 character,
        *   customer_id: ObjectId,
        * }
        */
        app.route('/edge/devcon/updateControllerConfig').post(this.edgeDeviceConfigUpdateController.updateControllerConfig);
        /**
         * Update wifi config
         * type: Post
         * parameters:{
         *   deviceId: 15 HexaDecimal number,
         *   ssid: within 5 to 32 alphanumeric,
         *   password: within 5 to 50 character,
         *   customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/updateWifiConfig').post(this.edgeDeviceConfigUpdateController.updateWifiConfig);
        /**
         * Update carrier config
         * type: Post
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  lteId: 20 alphanumeric,
         *  SecurityID: 15 alphanumeric,
         *  misc: 15 alphanumeric,
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/updateCarrierConfig').post(this.edgeDeviceConfigUpdateController.updateCarrierConfig);
        /**
         * Update Ble Config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  uuid: 16 byte with format, example xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
         *  majorNumber: within 0 to 65535
         *  minorNumber: within 0 to 65535,
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/updateBleConfig').post(this.edgeDeviceConfigUpdateController.updateBleConfig);
        /**
         * Update troubleshoot config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/updateTroubleshootConfig').post(this.edgeDeviceConfigUpdateController.updateTroubleshootConfig);
        /**
         * Get controller config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/getControllerConfig/:id').get(this.edgeDeviceConfigGetController.getControllerConfig);
        /**
         * Get wifi config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/getWifiConfig/:id').get(this.edgeDeviceConfigGetController.getWifiConfig);
        /**
         * Get carrier config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/getCarrierConfig/:id').get(this.edgeDeviceConfigGetController.getCarrierConfig);
        /**
         * Get Ble config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/getBleConfig/:id').get(this.edgeDeviceConfigGetController.getBleConfig);
        /**
         * Get troubleshoot config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/getTroubleshootConfig/:id').get(this.edgeDeviceConfigGetController.getTroubleshootConfig);
    }
}
exports.EdgeDeviceConfigRoutes = EdgeDeviceConfigRoutes;
//# sourceMappingURL=EdgeDeviceConfigRoutes.js.map