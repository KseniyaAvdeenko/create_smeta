class BaseRepository {
  /**
   * @param {import('sequelize').Model} model
   */
  constructor(model) {
    this.model = model;
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(where = {}, options = {}) {
    return this.model.findOne({ where, ...options });
  }

  async findAll(where = {}, options = {}) {
    return this.model.findAll({ where, ...options });
  }

  async update(id, data, options = {}) {
    const instance = await this.findById(id);
    if (!instance) return null;
    return instance.update(data, options);
  }

  async delete(id, options = {}) {
    const instance = await this.findById(id);
    if (!instance) return 0;
    await instance.destroy(options);
    return 1;
  }
}

module.exports = BaseRepository;


