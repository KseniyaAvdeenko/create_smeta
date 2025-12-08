const { DataTypes } = require('sequelize');

function defineOrderWork(sequelize) {
  const OrderWork = sequelize.define(
    'OrderWork',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      workId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'work_id',
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
      },
      measureQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'measure_quantity',
      },
    },
    {
      tableName: 'order_works',
      timestamps: false,
    },
  );

  return OrderWork;
}

module.exports = defineOrderWork;


