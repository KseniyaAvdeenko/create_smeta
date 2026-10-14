const {DataTypes, Model} = require('sequelize');

class SavedOrderFile extends Model {
    static associate(models) {
        SavedOrderFile.belongsTo(models.order, {as: 'order', foreignKey: 'orderId'});
        SavedOrderFile.belongsTo(models.user, {as: 'user', foreignKey: 'createdBy'});
    }
}

module.exports = (sequelize) => {
    SavedOrderFile.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdBy: {type: DataTypes.INTEGER, index: true},
            weblink: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gdriveFileId: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'gdrive_file_id',
            },
        },
        {
            sequelize,
            modelName: 'save_order_file',
            tableName: 'save_order_file',
            timestamps: true,
        },);
    return SavedOrderFile;
};


