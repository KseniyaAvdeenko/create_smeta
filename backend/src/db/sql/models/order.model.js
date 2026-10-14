const {DataTypes, Model} = require('sequelize');

class Order extends Model {
    static associate(models) {
        Order.belongsTo(models.user, {as:'user', foreignKey:'createdBy'});
        Order.hasMany(models.order_work, {as: 'orderWorks', foreignKey: 'orderId'});
        Order.hasMany(models.save_order_file, {as: 'savedOrderFiles', foreignKey: 'orderId'})
    }
}

module.exports = (sequelize) => {
    Order.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            client: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdBy: {type: DataTypes.INTEGER, index: true},
        },
        {
            sequelize,
            modelName: 'order',
            tableName: 'orders',
            timestamps: true,
        })
    return Order;
}



