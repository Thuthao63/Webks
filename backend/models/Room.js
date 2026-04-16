const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    roomNumber: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    status: { 
        type: DataTypes.STRING, 
        defaultValue: 'Available' 
    },
    // Khai báo rõ khóa ngoại typeId để khớp 100% với bản vẽ ERD
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'rooms', // Ép tên bảng khớp ERD
    timestamps: true
});

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
Room.associate = (models) => {
    // 1. Dây nối trỏ về bảng Loại Phòng (RoomType)
    Room.belongsTo(models.RoomType, { 
        foreignKey: 'typeId', 
        as: 'typeDetails' // Đặt tên as: 'typeDetails' để lúc gọi API ở Frontend React sẽ lấy được luôn ảnh và giá
    });

    // 2. Dây nối trỏ tới bảng Đơn Đặt (Booking)
    Room.hasMany(models.Booking, { 
        foreignKey: 'roomId', 
        as: 'bookings' 
    });
};

module.exports = Room;