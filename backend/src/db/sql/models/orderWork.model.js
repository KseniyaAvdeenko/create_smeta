const {DataTypes, Model} = require('sequelize');


class OrderWork extends Model {
    static associate(models) {
        OrderWork.belongsTo(models.order, {as: 'order', foreignKey: 'orderId'})
        OrderWork.belongsTo(models.work, {as: 'work', foreignKey: 'workId'})
        OrderWork.hasMany(models.order_work_quantity, {as: 'orderWorkQuantities', foreignKey: 'orderWorkId'});
    }
}

module.exports = (sequelize) => {
    OrderWork.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            workId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            total: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'order_work',
            tableName: 'order_works',
            timestamps: false,
        })
    return OrderWork;
};




