"use strict";
const crypto = require("crypto");
class SaltPassword {
    getRandomString(length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);
    }
    sha512(password, salt) {
        var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    }
    saltHashPassword(userpassword) {
        var salt = this.getRandomString(16); /** Gives us salt of length 16 */
        var passwordData = this.sha512(userpassword, salt);
        const returnData = {
            salt: salt,
            passwordHash: passwordData.passwordHash
        };
        return returnData;
    }
    getPasswordFromHash(saltKey, userpassword) {
        var passwordData = this.sha512(userpassword, saltKey);
        const returnData = {
            passwordHash: passwordData.passwordHash
        };
        return returnData;
    }
}
module.exports = new SaltPassword();
//# sourceMappingURL=salt_password.js.map