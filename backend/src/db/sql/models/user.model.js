const {Model, DataTypes} = require('sequelize');

class User extends Model {
    static associate(models) {
        User.hasMany(models.token, {as: 'tokens', foreignKey: 'userId'});
        User.hasOne(models.user_settings, {as: 'settings', foreignKey: 'userId'});
        User.hasOne(models.gdrive_connection, {as: 'gdriveConnection', foreignKey: 'userId'});
        User.hasOne(models.oauth_token, {as: 'oauthToken', foreignKey: 'userId'});
        User.hasMany(models.work_category, {as: 'workCategories', foreignKey: 'userId'});
        User.hasMany(models.order, {as: 'orders', foreignKey: 'createdBy'});
        User.hasMany(models.work, {as: 'works', foreignKey: 'userId'});
        User.hasMany(models.save_order_file, {as: 'savedOrdersFiles', foreignKey: 'createdBy'});
    }
}

module.exports = (sequelize) => {
    User.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            username: {type: DataTypes.STRING, allowNull: false, index: true},
            email: {type: DataTypes.STRING, allowNull: false, index: true, unique: true},
            password: {type: DataTypes.STRING, allowNull: false},
            isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
        },
        {
            sequelize,
            modelName: 'user',
            tableName: 'users',
            timestamps: true,
            underscored: true
        }
    );

    return User;
};