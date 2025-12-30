const {Sequelize} = require('sequelize');
const defineWorkCategory = require("./models/workCategory.model");
const defineMeasurement = require("./models/measurement.model");
const defineWork = require("./models/work.model");
const defineOrder = require("./models/order.model");
const defineOrderWork = require("./models/orderWork.model");
const defineSavedFile = require("./models/savedFile.model");
const defineWorkMeasurements = require("./models/workMeasurements.model");
const defineOrderWorkQuantity = require("./models/orderWorkQuantity.model");

require('dotenv').config();

class DatabaseClient {
    constructor(config) {
        this.sequelize = new Sequelize(`postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:5432/${config.DB_NAME}`)
        this.models = this.initModels(this.sequelize);
    }

    initModels(sequelize) {
        const WorkCategory = defineWorkCategory(sequelize);
        const Measurement = defineMeasurement(sequelize);
        const Work = defineWork(sequelize);
        const Order = defineOrder(sequelize);
        const OrderWork = defineOrderWork(sequelize);
        const SavedFile = defineSavedFile(sequelize);
        const WorkMeasurements = defineWorkMeasurements(sequelize);
        const OrderWorkQuantity = defineOrderWorkQuantity(sequelize)
        //workCats -> work
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
        // work -> work measurement

        WorkMeasurements.belongsTo(Work, {
            foreignKey: 'measurementId',
            sourceKey: 'id',
            as: 'work',
        });
        Work.hasMany(WorkMeasurements, {
            foreignKey: 'measurementId',
            targetKey: 'id',
            as: 'measurements',
        });
        //work -> orderWork
        OrderWork.belongsTo(Work, {
            foreignKey: 'workId',
            as: 'work',
        });
        Work.hasMany(OrderWork, {
            foreignKey: 'workId',
            as: 'orderWorks',
        });
        //Order -> OrderWorks
        OrderWork.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        Order.hasMany(OrderWork, {
            foreignKey: 'orderId',
            as: 'orderWorks',
        });
        //Order -> SavedFiles
        SavedFile.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        Order.hasMany(SavedFile, {
            foreignKey: 'orderId',
            as: 'savedFiles',
        });
        //OrderWork -> OrderWorkQuantity
         OrderWorkQuantity.belongsTo(OrderWork, {
            foreignKey: 'orderWorkId',
            as: 'orderWork',
        });
        OrderWork.hasMany(OrderWorkQuantity, {
            foreignKey: 'orderWorkId',
            as: 'orderWorkQuantities',
        });
        return {
            WorkCategory,
            Measurement,
            Work,
            Order,
            OrderWork,
            SavedFile,
            WorkMeasurements
        };
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            //console.log('Connection has been established successfully.');
            await this.sequelize.sync({alter: true});
            return true;
        } catch (error) {
            //console.error('Unable to connect to the database:', error);
            return false;
        }
    }
}


module.exports = DatabaseClient;

