const {Model, DataTypes} = require('sequelize');

class OAuthToken extends Model {
     static associate(models) {
        OAuthToken.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
    }
}

module.exports = (sequelize) => {
    OAuthToken.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, index: true},
            token: {type: DataTypes.STRING, allowNull: false},
        },
        {
            sequelize,
            modelName: 'oauth_token',
            tableName: 'oauth_tokens',
        }
    );

    return OAuthToken;
};