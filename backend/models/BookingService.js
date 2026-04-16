const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BookingService = sequelize.define('BookingService', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    bookingId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    serviceId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    // Quan trọng: Phải có cột số lượng (VD: Khách gọi 2 tô phở)
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'bookingservices', // Khớp ERD
    timestamps: false // Bảng trung gian thường không cần createdAt
});

// Bảng trung gian này chỉ đứng làm cầu nối, nên hàm associate để trống là được
BookingService.associate = (models) => {};

module.exports = BookingService;