const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('TollStation', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        locality: { type: DataTypes.STRING, allowNull: false },
        road: { type: DataTypes.STRING, allowNull: false },
        lat: { type: DataTypes.FLOAT, allowNull: false },
        long: { type: DataTypes.FLOAT, allowNull: false },
        price1: { type: DataTypes.FLOAT, allowNull: false },
        price2: { type: DataTypes.FLOAT, allowNull: false },
        price3: { type: DataTypes.FLOAT, allowNull: false },
        price4: { type: DataTypes.FLOAT, allowNull: false },
        operatorId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        tableName: 'tollstation',
        timestamps: false,
    });
};
