const { DataTypes } = require('sequelize');

function defineWorkCategory(sequelize) {
  const WorkCategory = sequelize.define(
    'WorkCategory',
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      tableName: 'work_categories',
      timestamps: false,
    },
  );

  return WorkCategory;
}

module.exports = defineWorkCategory;


