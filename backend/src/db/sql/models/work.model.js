const {DataTypes} = require('sequelize');


function defineWork(sequelize) {
    const Work = sequelize.define(
        'Work',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'work',
            timestamps: false,
            indexes: [
                {
                    fields: ['name'],
                },
            ],
        },
    );

    return Work;
}

module.exports = defineWork;


