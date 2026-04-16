const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
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
    comment: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    rating: { 
        type: DataTypes.INTEGER, 
        defaultValue: 5,
        validate: {
            min: 1, // Đảm bảo sao thấp nhất là 1
            max: 5  // Đảm bảo sao cao nhất là 5
        }
    }
}, { 
    tableName: 'reviews',
    timestamps: true 
});

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
Review.associate = (models) => {
    // 1 Đánh giá do 1 User viết
    Review.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'reviewer' 
    });

    // 1 Đánh giá dành cho 1 Phòng cụ thể
    Review.belongsTo(models.Room, { 
        foreignKey: 'roomId', 
        as: 'room' 
    });
};

module.exports = Review;