const {Model, DataTypes} = require('sequelize');

class Measurement extends Model {
    static associate(models) {
        Measurement.hasMany(models.work_measurement, {
            foreignKey: 'measurementId',
            as: 'workMeasurements',
        });
    }
}

module.exports = (sequelize) => {
    Measurement.init(
        {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            shortName: {type: DataTypes.STRING, index: true},
            fullName: {type: DataTypes.STRING},
        },
        {
            sequelize,
            modelName: 'measurement',
            tableName: 'measurements',
        }
    );

    return Measurement;
};