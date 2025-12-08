const {Sequelize} = require('sequelize');
const process = require('node:process');

const defineWorkCategory = require("./models/workCategory.model");
const defineMeasurement = require("./models/measurement.model");
const defineWork = require("./models/work.model");
const defineOrder = require("./models/order.model");
const defineOrderWork = require("./models/orderWork.model");
const defineSavedFile = require("./models/savedFile.model");

require('dotenv').config();

class DatabaseClient {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: 'postgres',
                logging: false,
            },
        );

        this.models = this.initModels(this.sequelize);
    }

    initModels(sequelize) {
        const WorkCategory = defineWorkCategory(sequelize);
        const Measurement = defineMeasurement(sequelize);
        const Work = defineWork(sequelize);
        const Order = defineOrder(sequelize);
        const OrderWork = defineOrderWork(sequelize);
        const SavedFile = defineSavedFile(sequelize);

        Work.belongsTo(WorkCategory, {
            foreignKey: 'categoryName',
            targetKey: 'name',
            as: 'category',
        });
        WorkCategory.hasMany(Work, {
            foreignKey: 'categoryName',
            sourceKey: 'name',
            as: 'works',
        });

        Work.belongsTo(Measurement, {
            foreignKey: 'measurementId',
            targetKey: 'id',
            as: 'measurement',
        });
        Measurement.hasMany(Work, {
            foreignKey: 'measurementId',
            sourceKey: 'id',
            as: 'works',
        });

        OrderWork.belongsTo(Work, {
            foreignKey: 'workId',
            as: 'work',
        });
        Work.hasMany(OrderWork, {
            foreignKey: 'workId',
            as: 'orderWorks',
        });

        OrderWork.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        Order.hasMany(OrderWork, {
            foreignKey: 'orderId',
            as: 'orderWorks',
        });

        SavedFile.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        Order.hasMany(SavedFile, {
            foreignKey: 'orderId',
            as: 'savedFiles',
        });

        return {
            WorkCategory,
            Measurement,
            Work,
            Order,
            OrderWork,
            SavedFile,
        };
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
            await this.sequelize.sync({alter: true});
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }
}


module.exports = DatabaseClient;

