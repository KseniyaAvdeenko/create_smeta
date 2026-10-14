const {DataTypes, Model} = require('sequelize');

class OrderWorkQuantity extends Model {
    static associate(models) {
        OrderWorkQuantity.belongsTo(models.order_work, {as: 'orderWork', foreignKey: 'orderWorkId'});
    }
}

module.exports = (sequelize)=> {
    OrderWorkQuantity.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            orderWorkId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            measurement: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'order_work_quantity',
            tableName: 'order_work_quantity',
            timestamps: false,
        })
    return OrderWorkQuantity;
}


