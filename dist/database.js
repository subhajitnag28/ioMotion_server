"use strict";
const mongodb_1 = require("mongodb");
class Database {
    constructor() {
        this.connection = null;
    }
    /**
     * connect with mongodb
     */
    connect(uri) {
        let _base = this;
        mongodb_1.MongoClient.connect(uri, function (err, client) {
            if (err) {
                console.log('Connection with mongoDb failed');
                process.exit(1);
            }
            else {
                console.log('Connected...');
                _base.connection = client;
            }
        });
    }
    /**
     * get database status
     */
    get() {
        if (!this.connection) {
            console.log('connect to databae first');
        }
        return this.connection;
    }
}
module.exports = new Database();
//# sourceMappingURL=database.js.map