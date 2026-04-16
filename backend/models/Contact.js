const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Contact = sequelize.define('Contact', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    phone: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    subject: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    message: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    status: { 
        // Đổi từ ENUM sang STRING để tránh lỗi văng Server khi dữ liệu không khớp
        type: DataTypes.STRING, 
        defaultValue: 'Pending' 
    }
}, {
    tableName: 'contacts', // Chữ thường để đồng bộ toàn hệ thống
    timestamps: true
});

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
Contact.associate = (models) => {
    // Bảng Contact đứng độc lập, không nối với bảng nào.
    // Việc khai báo hàm rỗng này giúp file server.js vòng lặp qua không bị vấp lỗi.
};

module.exports = Contact;