const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Newsletter = sequelize.define('Newsletter', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    status: { 
        type: DataTypes.STRING, 
        defaultValue: 'active' // active, unsubscribed
    }
}, {
    tableName: 'newsletters',
    timestamps: true
});

module.exports = Newsletter;
