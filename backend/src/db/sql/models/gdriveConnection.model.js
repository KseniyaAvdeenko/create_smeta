const {Model, DataTypes} = require('sequelize');

class GdriveConnection extends Model {
    static associate(models) {
        GdriveConnection.belongsTo(models.user, {as: 'user', foreignKey: 'userId'});
    }
}

module.exports = (sequelize) => {
    GdriveConnection.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            userId: {type: DataTypes.INTEGER, index: true},
            access: {type: DataTypes.STRING, allowNull: false},
            refresh: {type: DataTypes.STRING, allowNull: false},
            email: {type: DataTypes.STRING, allowNull: false},
            defaultFolder: {type: DataTypes.STRING, allowNull: true},
        },
        {
            sequelize,
            modelName: 'gdrive_connection',
            tableName: 'gdrive_connection',
            timestamps: true,
            underscored: true
        }
    );

    return GdriveConnection;
};