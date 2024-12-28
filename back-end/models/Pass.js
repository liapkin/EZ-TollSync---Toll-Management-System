const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pass', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        timestamp: { type: DataTypes.INTEGER, allowNull: false },
        charge: { type: DataTypes.INTEGER, allowNull: false },
        tagId: { type: DataTypes.INTEGER, allowNull: false },
        tollStationId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        tableName: 'pass',
        timestamps: false,
    });
};
