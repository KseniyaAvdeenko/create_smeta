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
   * Инициализация структуры Firestore (создание документов с пустыми массивами)
   */
  async _initializeFirestoreStructure() {
    const structure = [
      { collection: 'SmetaWorks', doc: 'Works' },
      { collection: 'SmetaWorks', doc: 'WorkCategories' },
      { collection: 'SmetaWorks', doc: 'Measurements' },
      { collection: 'SmetaOrders', doc: 'Orders' },
      { collection: 'SmetaOrders', doc: 'OrderWorks' },
      { collection: 'SmetaOrders', doc: 'OrderFiles' },
    ];

    for (const { collection, doc } of structure) {
      const docRef = firebaseDb.collection(collection).doc(doc);
      const snapshot = await docRef.get();
      
      if (!snapshot.exists) {
        await docRef.set({ data: [] });
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
        // Создаем структуру коллекций, если их нет
        await this._initializeFirestoreStructure();
        console.log('Firebase подключен и инициализирован');
      } catch (error) {
        console.log('Firebase подключен, но коллекции недоступны:', error);
        console.log('Error details:', error.code, error.details);
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