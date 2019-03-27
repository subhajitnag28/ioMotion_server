import { UserController } from "../controllers/UserController";

export class UserRoutes {

    public userController: UserController = new UserController();

    public routes(app: any): void {

        // User registration 
        app.route('/registration').post(this.userController.userRegistration);

        // User login
        app.route('/login').post(this.userController.userLogin);

        // Send otp
        app.route('/sendOtp').post(this.userController.sendOtp);

        // Reset password
        app.route('/passwordReset').post(this.userController.passwordReset);

        // Get User by Id
        app.route('/getUserById/:id').get(this.userController.getUserById);

        // Get Users and customer by role by admin
        app.route('/getUsersByRole').post(this.userController.getUsersByRole);

        // Get Users by role and customer id by customer
        app.route('/getUsersByRoleAndCustomerId').post(this.userController.getUsersByRoleAndCustomerId);

        // Update User details
        app.route('/updateUser').post(this.userController.updateUser);

        // Change password
        app.route('/changePassword').post(this.userController.changePassword);

        //delete user
        app.route('/deleteUser/:id').get(this.userController.deleteUser);

        //search user by admin
        app.route('/searchUser').post(this.userController.searchUser);

        //search user by customer
        app.route('/searchUserByCustomer').post(this.userController.searchUserByCustomer);

        /**
         * provide perticular user to install microservices
         * 
         * user_id, microserviceInstallAccess
         */
        app.route('/userAccessToInstallMicroservices').post(this.userController.userAccessToInstallMicroservices);
    }
}