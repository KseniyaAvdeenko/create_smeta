const { DataTypes } = require('sequelize');

function defineSavedFile(sequelize) {
  const SavedFile = sequelize.define(
    'SavedFile',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'saved_files',
      timestamps: false,
    },
  );

  return SavedFile;
}

module.exports = defineSavedFile;


