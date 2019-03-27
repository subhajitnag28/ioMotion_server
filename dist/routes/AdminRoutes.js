"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminController_1 = require("../controllers/AdminController");
class AdminRoutes {
    constructor() {
        this.adminController = new AdminController_1.AdminController();
    }
    routes(app) {
        /**
         * Admin registration
         * type:Post,
         * parameters:{
         * 	email: String, minimum domain atom 2
         * 	password: String, minimum 6 character long
         * }
         */
        app.route('/admin/registration').post(this.adminController.adminRegistration);
        /**
         * Admin login
         * type:POst,
         * parameters:{
         * 	email: String, minimum domain atom 2
         * 	password: String, minimum 6 character long
         * }
         */
        app.route('/admin/login').post(this.adminController.adminLogin);
        /**
         * Send otp
         * type:Post,
         * parameters:{
         * 	email: String, minimum domain atom 2
         * }
         */
        app.route('/admin/send-otp').post(this.adminController.sendOtp);
        /**
         * Password reset
         * type:Post,
         * parameters:{
         * 	email: String, minimum domain atom 2,
         * 	password: String, minimum 6 character long,
         * 	otp: length must to be 6
         * }
        */
        app.route('/admin/reset-password').post(this.adminController.passwordReset);
        /**
         * Get admin details
         * type:Get
         * parameters:{
         * 	token: jwt token
         * }
        */
        app.route('/admin/get-admin-details').get(this.adminController.getAdminById);
        /**
         * Update admin details
         * type:Post,
         * parameters:{
         * 	token with updated field
         * }
         */
        app.route('/admin/update-admin-details').post(this.adminController.updateAdmin);
        /**
         * Change password
         * type:Post,
         * parameters:{
         * 	email: String, minimum domain atom 2,
         * 	oldPassword: String, minimum 6 character long,
         * 	newPassword: String, minimum 6 character long,
         * 	token: jwt token
         * }
         */
        app.route('/admin/change-password').post(this.adminController.changePassword);
    }
}
exports.AdminRoutes = AdminRoutes;
//# sourceMappingURL=AdminRoutes.js.map