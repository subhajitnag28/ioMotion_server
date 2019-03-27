import * as crypto from 'crypto';

class SaltPassword {

    public getRandomString(length: number) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);
    }

    public sha512(password: string, salt: any) {
        var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    }

    public saltHashPassword(userpassword: string) {
        var salt = this.getRandomString(16); /** Gives us salt of length 16 */
        var passwordData = this.sha512(userpassword, salt);
        const returnData = {
            salt: salt,
            passwordHash: passwordData.passwordHash
        };
        return returnData;
    }

    public getPasswordFromHash(saltKey: any, userpassword: string) {
        var passwordData = this.sha512(userpassword, saltKey);
        const returnData = {
            passwordHash: passwordData.passwordHash
        };
        return returnData;
    }
}

export = new SaltPassword();