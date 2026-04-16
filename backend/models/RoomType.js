const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RoomType = sequelize.define('RoomType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }, // Ví dụ: VIP, Standard
    price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    capacity: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    // Bổ sung các cột theo đúng chuẩn bản vẽ ERD
    image: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    amenities: { 
        type: DataTypes.JSON, 
        allowNull: true 
    },
    rating: { 
        type: DataTypes.FLOAT, 
        defaultValue: 5.0 
    },
    description: { 
        type: DataTypes.TEXT 
    }
}, {
    tableName: 'roomtypes', // Ép kiểu tên bảng giống hệt trong MySQL
    timestamps: true
});

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
RoomType.associate = (models) => {
    // Một Loại Phòng (RoomType) có thể có nhiều Phòng cụ thể (Room)
    RoomType.hasMany(models.Room, { 
        foreignKey: 'typeId', 
        as: 'rooms' 
    });
};

module.exports = RoomType;