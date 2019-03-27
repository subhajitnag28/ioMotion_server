import { MongoClient } from 'mongodb';

class Database {

    public connection = null;

    /**
     * connect with mongodb
     */
    public connect(uri: string) {
        let _base = this;
        MongoClient.connect(uri, function (err, client) {
            if (err) {
                console.log('Connection with mongoDb failed');
                process.exit(1);
            } else {
                console.log('Connected...');
                _base.connection = client;
            }
        });
    }

    /**
     * get database status
     */
    public get() {
        if (!this.connection) {
            console.log('connect to databae first');
        }
        return this.connection;
    }
}

export = new Database();