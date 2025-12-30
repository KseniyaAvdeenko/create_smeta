const { DataTypes } = require('sequelize');


function defineWorkMeasurements(sequelize) {
  const WorkMeasurements = sequelize.define(
    'WorkMeasurement',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      measurementId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'category',
      },
    },
    {
      tableName: 'work_measurements',
      timestamps: false,
    },
  );

  return WorkMeasurements;
}

module.exports = defineWorkMeasurements;


