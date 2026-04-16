const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    fullName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    // Thêm trường phone để khớp ERD và thực tế đặt phòng
    phone: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: { 
        type: DataTypes.ENUM('Customer', 'Receptionist', 'Admin'), 
        defaultValue: 'Customer' 
    },
    isVerified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    verificationCode: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
}, {
    tableName: 'users',
    timestamps: true
});

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
User.associate = (models) => {
    // Một Khách hàng (User) có thể có nhiều Đơn đặt phòng (Booking)
    User.hasMany(models.Booking, { 
        foreignKey: 'userId', 
        as: 'bookings' 
    });
};

module.exports = User;