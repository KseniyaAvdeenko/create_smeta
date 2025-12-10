const { DataTypes } = require('sequelize');


function defineMeasurement(sequelize) {
  const Measurement = sequelize.define(
    'Measurement',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      tableName: 'measurements',
      timestamps: false,
    },
  );

  return Measurement;
}

module.exports = defineMeasurement;


