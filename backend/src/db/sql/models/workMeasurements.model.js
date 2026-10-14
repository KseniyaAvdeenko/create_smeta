const {DataTypes, Model} = require('sequelize');

class WorkMeasurement extends Model {
    static associate(models) {
        WorkMeasurement.belongsTo(models.work, {
            foreignKey: 'workId',
            as: 'work',
        });
        WorkMeasurement.belongsTo(models.measurement, {
            foreignKey: 'measurementId',
            as: 'measurement',
        });
    }
}

module.exports = (sequelize) => {
    WorkMeasurement.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            workId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            measurementId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            cost: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'work_measurement',
            tableName: 'work_measurements',
            timestamps: false,
        });
    return WorkMeasurement
};



