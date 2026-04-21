const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roomTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discountPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'discounts',
    timestamps: true
});

module.exports = Discount;
