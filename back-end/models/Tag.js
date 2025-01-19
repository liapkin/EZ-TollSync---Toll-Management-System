const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Tag', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tagRef: { type: DataTypes.STRING, allowNull: false },
        operatorId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        tableName: 'tag',
        timestamps: false,
    });
};
