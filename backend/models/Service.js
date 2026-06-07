const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    roomTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roomtypes',
            key: 'id'
        }
    }
}, {
    tableName: 'services', // Khớp ERD
    timestamps: true
});

// THIẾT LẬP QUAN HỆ
Service.associate = (models) => {
    // 1 Dịch vụ có thể có trong nhiều Đơn đặt phòng (Thông qua bảng BookingService)
    Service.belongsToMany(models.Booking, { 
        through: models.BookingService, 
        foreignKey: 'serviceId',
        as: 'bookings' 
    });

    // 1 Dịch vụ chỉ thuộc về 1 Loại Phòng
    Service.belongsTo(models.RoomType, {
        foreignKey: 'roomTypeId',
        as: 'roomType'
    });
};

module.exports = Service;