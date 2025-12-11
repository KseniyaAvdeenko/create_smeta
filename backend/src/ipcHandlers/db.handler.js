const  postgresConfig  = require('../config/db.config');
const SqlDatabaseClient = require('../db/sql/db.client');
const { createRepositories: createSqlRepositories } = require('../repositories/sql');
const { createFirebaseRepositories } = require('../repositories/firebase');
const { db: firebaseDb } = require('../db/firebase/firebase.client');
const { collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

class DbHandler {
  constructor() {
    this.mode = process.env.DB_MODE; // 'sql' | 'firebase'

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
    if (this.mode === 'sql') {
      return this.dbClient.connect();
    }

    if (this.mode === 'firebase') {
      const worksSnapshot = await getDocs(collection(firebaseDb, 'smetaWorks'));
      console.log(`Firebase подключен. Найдено документов в smetaWorks: ${worksSnapshot.size}`);
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