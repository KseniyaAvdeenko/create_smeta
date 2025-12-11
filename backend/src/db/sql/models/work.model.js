const { DataTypes } = require('sequelize');


function defineWork(sequelize) {
  const Work = sequelize.define(
    'Work',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'category',
      },
      measurementId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'measurement_id',
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'work',
      timestamps: false,
      indexes: [
        {
          fields: ['name'],
        },
      ],
    },
  );

  return Work;
}

module.exports = defineWork;


