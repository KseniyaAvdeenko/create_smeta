const {DataTypes} = require('sequelize');

function defineOrderWorkQuantity(sequelize) {
    const OrderWorkQuantity = sequelize.define(
        'OrderWorkQuantity',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            orderWorkId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'orderWorkId',
            },
            measurement: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'quantity',
            },
        },
        {
            tableName: 'order_work_quantity',
            timestamps: false,
        },
    );

    return OrderWorkQuantity;
}

module.exports = defineOrderWorkQuantity;


