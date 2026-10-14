const {Model, DataTypes} = require('sequelize');

class WorkCategory extends Model {
     static associate(models) {
        WorkCategory.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
        WorkCategory.hasMany(models.work, {as: 'works', foreignKey: 'categoryId'});
    }
}

module.exports = (sequelize) => {
    WorkCategory.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, index: true},
            name: {type: DataTypes.STRING},
        },
        {
            sequelize,
            modelName: 'work_category',
            tableName: 'work_category',
        }
    );

    return WorkCategory;
};