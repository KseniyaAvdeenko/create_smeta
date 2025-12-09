class DbHandler {
    constructor() {
        this.dbConfig = require('../config/db.config')
        this.DatabaseClient = require('../db/db.client');
        this.dbClient = new this.DatabaseClient(this.dbConfig.postgresConfig);
    }

     getDbConnection =async()=> await this.dbClient.connect();

}
module.exports = DbHandler;