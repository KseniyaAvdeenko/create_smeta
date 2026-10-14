const {DataTypes, Model} = require('sequelize');

class Work extends Model {
    static associate(models) {
        Work.belongsTo(models.work_category, {as: 'category', foreignKey: 'categoryId'});
        Work.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
        Work.hasMany(models.work_measurement, {as: 'workMeasurements', foreignKey: 'workId'});
        Work.hasMany(models.order_work, {as: 'orderWorks', foreignKey: 'workId'});
    }
}

module.exports = (sequelize) => {
    Work.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {type: DataTypes.INTEGER, index: true},
        },
        {
            sequelize,
            modelName: 'work',
            tableName: 'work',
            timestamps: false,
            indexes: [
                {
                    fields: ['name'],
                },
            ],
        })
    return Work;
}


