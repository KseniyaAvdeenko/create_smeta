const  postgresConfig  = require('../config/db.config');
const SqlDatabaseClient = require('../db/sql/db.client');
const { createRepositories: createSqlRepositories } = require('../repositories/sql');
const { createFirebaseRepositories } = require('../repositories/firebase');
const { db: firebaseDb } = require('../db/firebase/firebase.client');
require('dotenv').config();

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

  /**
   * Унифицированный метод "проверки подключения".
   * - для SQL реально коннектится к Postgres
   * - для Firebase просто возвращает true (или можно добавить тестовый запрос при необходимости)
   */
  getDbConnection = async () => {
    if (this.mode === 'sql') return this.dbClient.connect();

    if (this.mode === 'firebase') {
      try {
        const collections = ['SmetaWorks', 'SmetaOrders'];
        for (const collName of collections) {
          const snapshot = await firebaseDb.collection(collName).get();
          console.log(`${collName}: ${snapshot.size} документов`);
        }
      } catch (error) {
        console.log('Firebase подключен, но коллекции недоступны:', error.message);
      }
      return true;
    }
  };

  // Геттеры для репозиториев – интерфейс одинаковый для SQL и Firebase
  get workRepository() {
    return this.repositories.workRepository;
  }

  get workCategoryRepository() {
    return this.repositories.workCategoryRepository;
  }

  get measurementRepository() {
    return this.repositories.measurementRepository;
  }

  get orderRepository() {
    return this.repositories.orderRepository;
  }

  get orderWorkRepository() {
    return this.repositories.orderWorkRepository;
  }

  get savedFileRepository() {
    return this.repositories.savedFileRepository;
  }
}

module.exports = DbHandler;