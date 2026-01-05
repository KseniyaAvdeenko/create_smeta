const {DataTypes} = require('sequelize');

function defineWorkCategory(sequelize) {
    const WorkCategory = sequelize.define(
        'WorkCategory',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
        },
        {
            tableName: 'work_categories',
            timestamps: false,
        },
    );

    return WorkCategory;
}

module.exports = defineWorkCategory;


