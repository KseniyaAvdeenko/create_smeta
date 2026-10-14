const {Model, DataTypes} = require('sequelize');

class UserSettings extends Model {
     static associate(models) {
        UserSettings.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
    }
}

module.exports = (sequelize) => {
    UserSettings.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, index: true},
            desktopMode: {type: DataTypes.STRING, defaultValue: 'system'},
        },
        {
            sequelize,
            modelName: 'user_settings',
            tableName: 'user_settings',
        }
    );

    return UserSettings;
};