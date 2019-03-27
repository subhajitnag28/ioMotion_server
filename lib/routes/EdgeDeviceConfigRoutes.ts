import { EdgeDeviceConfigCreateController } from "../controllers/EdgeDeviceConfigController/EdgeDeviceConfigCreateController";
import { EdgeDeviceConfigUpdateController } from "../controllers/EdgeDeviceConfigController/EdgeDeviceConfigUpdateController";
import { EdgeDeviceConfigGetController } from "../controllers/EdgeDeviceConfigController/EdgeDeviceConfigGetController";

export class EdgeDeviceConfigRoutes {

    public edgeDeviceConfigCreateController: EdgeDeviceConfigCreateController = new EdgeDeviceConfigCreateController();
    public edgeDeviceConfigUpdateController: EdgeDeviceConfigUpdateController = new EdgeDeviceConfigUpdateController();
    public edgeDeviceConfigGetController: EdgeDeviceConfigGetController = new EdgeDeviceConfigGetController();

    public routes(app: any): void {

        /**
         * Install controller config
         * type: Post
         * parameters: {
         *   deviceId: 15 HexaDecimal number,
         *   deviceName: within 5 to 15 alphanumeric,
         *   locationName: within 10 to 200 character,
         *   customer_id: ObjectId,
         *   installed: true
         * }
         */

        app.route('/edge/devcon/install-controller-config').post(this.edgeDeviceConfigCreateController.installControllerConfig);

        /**
         * Install wifi config
         * type: Post
         * parameters:{
         *   deviceId: 15 HexaDecimal number,
         *   ssid: within 5 to 32 alphanumeric,
         *   password: within 5 to 50 character,
         *   customer_id: ObjectId,
         *   installed: true
         * }
         */
        app.route('/edge/devcon/install-wifi-config').post(this.edgeDeviceConfigCreateController.installWifiConfig);

        /**
         * Install carrier config
         * type: Post
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  lteId: 20 alphanumeric,
         *  SecurityID: 15 alphanumeric,
         *  misc: 15 alphanumeric,
         *  customer_id: ObjectId,
         *  installed: true
         * }
         */
        app.route('/edge/devcon/install-carrier-config').post(this.edgeDeviceConfigCreateController.installCarrierConfig);

        /**
         * Install Ble Config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  uuid: 16 byte with format, example xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
         *  majorNumber: within 0 to 65535
         *  minorNumber: within 0 to 65535,
         *  customer_id: ObjectId,
         *  installed: true
         * }
         */
        app.route('/edge/devcon/install-ble-config').post(this.edgeDeviceConfigCreateController.installBleConfig);

        /**
         * Install troubleshoot config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  customer_id: ObjectId,
         *  installed: true
         * }
         */
        app.route('/edge/devcon/install-troubleshoot-config').post(this.edgeDeviceConfigCreateController.installTroubleshootConfig);



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

        app.route('/edge/devcon/update-controller-config').post(this.edgeDeviceConfigUpdateController.updateControllerConfig);

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
        app.route('/edge/devcon/update-wifi-config').post(this.edgeDeviceConfigUpdateController.updateWifiConfig);

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
        app.route('/edge/devcon/update-carrier-config').post(this.edgeDeviceConfigUpdateController.updateCarrierConfig);

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
        app.route('/edge/devcon/update-ble-config').post(this.edgeDeviceConfigUpdateController.updateBleConfig);

        /**
         * Update troubleshoot config
         * type: Post,
         * parameters:{
         *  deviceId: 15 HexaDecimal number,
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/update-troubleshoot-config').post(this.edgeDeviceConfigUpdateController.updateTroubleshootConfig);



        /**
         * Get controller config
         * type: Post
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/get-controller-config').get(this.edgeDeviceConfigGetController.getControllerConfig);

        /**
         * Get wifi config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/get-wifi-config').get(this.edgeDeviceConfigGetController.getWifiConfig);

        /**
         * Get carrier config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/get-carrier-config').get(this.edgeDeviceConfigGetController.getCarrierConfig);

        /**
         * Get Ble config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/get-ble-config').get(this.edgeDeviceConfigGetController.getBleConfig);

        /**
         * Get troubleshoot config
         * type: Get
         * parameters:{
         *  customer_id: ObjectId
         * }
         */
        app.route('/edge/devcon/get-troubleshoot-config').get(this.edgeDeviceConfigGetController.getTroubleshootConfig);
    }
}