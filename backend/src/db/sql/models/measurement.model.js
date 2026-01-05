const {DataTypes} = require('sequelize');


function defineMeasurement(sequelize) {
    const Measurement = sequelize.define(
        'Measurement',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
        },
        {
            tableName: 'measurements',
            timestamps: false,
        },
    );

    return Measurement;
}

module.exports = defineMeasurement;


