const { Sequelize } = require('sequelize');
const OperatorModel = require('./Operator');
const TagModel = require('./Tag');
const TollStationModel = require('./Tollstation');
const PassModel = require('./Pass');

const sequelize = new Sequelize('test_db', 'admin', 'root', {
    host: 'localhost',
    dialect: 'postgres',
});

const models = {
    Operator: OperatorModel(sequelize),
    Tag: TagModel(sequelize),
    TollStation: TollStationModel(sequelize),
    Pass: PassModel(sequelize),
};

// Define relationships
models.Operator.hasMany(models.TollStation, { foreignKey: 'operatorId' });
models.TollStation.belongsTo(models.Operator, { foreignKey: 'operatorId' });

models.Operator.hasMany(models.Tag, { foreignKey: 'operatorId' });
models.Tag.belongsTo(models.Operator, { foreignKey: 'operatorId' });

models.Tag.hasMany(models.Pass, { foreignKey: 'tagId' });
models.Pass.belongsTo(models.Tag, { foreignKey: 'tagId' });

models.TollStation.hasMany(models.Pass, { foreignKey: 'tollStationId' });
models.Pass.belongsTo(models.TollStation, { foreignKey: 'tollStationId' });


// models.Operator.hasMany(models.Tag, { foreignKey: 'providerId' });
// models.Tag.belongsTo(models.Operator, { foreignKey: 'providerId' });

// models.Tag.hasMany(models.Pass, { foreignKey: 'tagId' });
// models.Pass.belongsTo(models.Tag, { foreignKey: 'tagId' });

// models.TollStation.hasMany(models.Pass, { foreignKey: 'tollStationId' });
// models.Pass.belongsTo(models.TollStation, { foreignKey: 'tollStationId' });

module.exports = { sequelize, models };
