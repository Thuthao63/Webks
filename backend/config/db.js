const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối Sequelize tới MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Tắt các dòng log SQL chi tiết để console gọn hơn
    }
);

// Kiểm tra kết nối
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL thành công (Sequelize)!');
    } catch (error) {
        console.error('❌ Không thể kết nối MySQL:', error);
        process.exit(1); // Dừng app nếu không kết nối được DB
    }
};

module.exports = { sequelize, connectDB };