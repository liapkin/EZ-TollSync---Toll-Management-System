const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Operator', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false },
        code: { type: DataTypes.STRING(3), allowNull: false },
    }, {
        tableName: 'operator',
        timestamps: false,
    });
};
