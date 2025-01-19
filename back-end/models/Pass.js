const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pass', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        timestamp: { type: DataTypes.STRING, allowNull: true },
        charge: { type: DataTypes.REAL, allowNull: false },
        tagId: { type: DataTypes.INTEGER, allowNull: true },
        tollStationId: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        tableName: 'pass',
        timestamps: false,
    });
};
