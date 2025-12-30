const postgresConfig = require('../config/db.config');
const SqlDatabaseClient = require('../db/sql/db.client');
const {createRepositories: createSqlRepositories} = require('../repositories/sql');
const {createFirebaseRepositories} = require('../repositories/firebase');
const {db: firebaseDb} = require('../db/firebase/firebase.client');
const {app} = require("electron");
const path = require("path");
const process = require("node:process");
require('dotenv').config(
    {
        path: app.isPackaged
            ? path.join(process.resourcesPath, '.env')
            : path.join(process.cwd(), '.env')
    }
);

class DbHandler {
    constructor() {
        this.mode = (process.env.DB_MODE || 'sql').toLowerCase(); // 'sql' | 'firebase'

        if (this.mode === 'sql') {
            this.dbClient = new SqlDatabaseClient(postgresConfig);
            this.repositories = createSqlRepositories(this.dbClient.models);
        } else if (this.mode === 'firebase') {
            this.dbClient = null;
            this.repositories = createFirebaseRepositories(firebaseDb);
        } else {
            throw new Error(`Unsupported DB_MODE: ${this.mode}. Use "sql" or "firebase".`);
        }
    }

    async _initializeFirestoreStructure() {
        const structure = [
            {collection: 'SmetaWorks', doc: 'Works'},
            {collection: 'SmetaWorks', doc: 'WorkCategories'},
            {collection: 'SmetaWorks', doc: 'Measurements'},
            {collection: 'SmetaOrders', doc: 'Orders'},
            {collection: 'SmetaOrders', doc: 'OrderWorks'},
            {collection: 'SmetaOrders', doc: 'OrderFiles'},
            {collection: "App", doc: 'Settings'}
        ];

        for (const {collection, doc} of structure) {
            const docRef = firebaseDb.collection(collection).doc(doc);
            const snapshot = await docRef.get();

            if (!snapshot.exists) {
                await docRef.set({data: []});
                console.log(`Document created: ${collection}/${doc}`);
            }
        }
    }

    /**
     * Унифицированный метод "проверки подключения".
     * - для SQL реально коннектится к Postgres
     * - для Firebase просто возвращает true (или можно добавить тестовый запрос при необходимости)
     */
    getDbConnection = async () => {
        if (this.mode === 'sql') return this.dbClient.connect();

        if (this.mode === 'firebase') {
            try {
                await this._initializeFirestoreStructure();
                console.log('Firebase is connected and initialized');
            } catch (error) {
                console.log('Firebase is connected, but collections are unavailable:', error);
            }
            return true;
        }
    };

    workRepository() {
        return this.repositories.workRepository;
    };


    workCategoryRepository() {
        return this.repositories.workCategoryRepository;
    };


    measurementRepository() {
        return this.repositories.measurementRepository;
    };


    orderRepository() {
        return this.repositories.orderRepository;
    };


    orderWorkRepository() {
        return this.repositories.orderWorkRepository;
    };


    savedFileRepository() {
        return this.repositories.savedFileRepository;
    };
}

module.exports = DbHandler;