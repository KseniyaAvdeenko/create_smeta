const fs = require('fs');
const path = require('path');

function initModels(sequelize) {
  const models = {};

  const modelFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith('.model.js'));

  for (const file of modelFiles) {
    const defineModel = require(path.join(__dirname, file));
    const model = defineModel(sequelize);
    models[model.name] = model;
  }

  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

  return models;
}

module.exports = { initModels };
