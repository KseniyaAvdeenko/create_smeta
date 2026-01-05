const {DataTypes} = require('sequelize');


function defineWorkMeasurements(sequelize) {
    const WorkMeasurements = sequelize.define(
        'WorkMeasurement',
        {
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
            tableName: 'work_measurements',
            timestamps: false,
        },
    );

    return WorkMeasurements;
}

module.exports = defineWorkMeasurements;


