const {Model, DataTypes} = require('sequelize');

class Token extends Model {
     static associate(models) {
        Token.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
    }
}

module.exports = (sequelize) => {
    Token.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, index: true},
            refresh: {type: DataTypes.STRING, allowNull: false},
            userAgent: {type: DataTypes.STRING, allowNull: true}
        },
        {
            sequelize,
            modelName: 'token',
            tableName: 'tokens',
        }
    );

    return Token;
};