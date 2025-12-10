const { collection, doc, getDoc, setDoc } = require('firebase/firestore');

/**
 * Базовый репозиторий для документов вида:
 * { data: [ {...}, {...} ] }
 * в коллекции Firestore.
 */
class FirebaseArrayDocRepository {
  /**
   * @param {import('firebase/firestore').Firestore} db
   * @param {string} collectionName
   * @param {string} docId
   * @param {string} idField - поле, используемое как идентификатор элемента (по умолчанию "id")
   */
  constructor(db, collectionName, docId, idField = 'id') {
    this.db = db;
    this.collectionName = collectionName;
    this.docId = docId;
    this.idField = idField;
  }

  _docRef() {
    return doc(collection(this.db, this.collectionName), this.docId);
  }

  async _loadArray() {
    const snap = await getDoc(this._docRef());
    if (!snap.exists()) return [];
    const data = snap.data();
    return Array.isArray(data.data) ? data.data : [];
  }

  async _saveArray(items) {
    await setDoc(this._docRef(), { data: items });
  }

  async getAll() {
    return this._loadArray();
  }

  async getById(id) {
    const items = await this._loadArray();
    return items.find((item) => item[this.idField] === id) || null;
  }

  async create(item) {
    const items = await this._loadArray();

    // Если ID не задан, генерируем числовой на основе максимального существующего
    if (item[this.idField] == null) {
      const maxId = items.reduce((max, it) => {
        const value = it[this.idField];
        return typeof value === 'number' ? Math.max(max, value) : max;
      }, 0);

      item = {
        ...item,
        [this.idField]: maxId + 1,
      };
    }

    items.push(item);
    await this._saveArray(items);
    return item;
  }

  async update(id, patch) {
    const items = await this._loadArray();
    let updated = null;

    const newItems = items.map((it) => {
      if (it[this.idField] === id) {
        updated = { ...it, ...patch, [this.idField]: id };
        return updated;
      }
      return it;
    });

    if (!updated) return null;

    await this._saveArray(newItems);
    return updated;
  }

  async delete(id) {
    const items = await this._loadArray();
    const newItems = items.filter((it) => it[this.idField] !== id);
    const deleted = newItems.length !== items.length;

    if (!deleted) return 0;

    await this._saveArray(newItems);
    return 1;
  }
}

module.exports = FirebaseArrayDocRepository;


