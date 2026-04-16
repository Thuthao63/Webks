const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    roomId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    checkInDate: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    checkOutDate: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    totalPrice: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.STRING, 
        defaultValue: 'pending' // pending, confirmed, completed, cancelled
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
Booking.associate = (models) => {
    // Đơn đặt phòng thuộc về 1 Khách hàng
    Booking.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'customer' 
    
    });
    
    // Đơn đặt phòng tham chiếu đến 1 Phòng cụ thể
    Booking.belongsTo(models.Room, { 
        foreignKey: 'roomId', 
        as: 'roomDetails' 
    });
    
    // Đơn đặt phòng có nhiều dịch vụ kèm theo (N-N)
    Booking.belongsToMany(models.Service, { 
        through: models.BookingService, 
        foreignKey: 'bookingId',
        as: 'services' 
    });
};

module.exports = Booking;