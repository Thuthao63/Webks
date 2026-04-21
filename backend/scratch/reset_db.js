const { sequelize } = require('../config/db');

async function resetDatabase() {
  try {
    console.log('🗑️  Đang xóa toàn bộ bảng (Tên chính xác) để làm sạch Database...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    // Danh sách tên bảng CHÍNH XÁC lấy từ lệnh SHOW TABLES
    const tables = [
      'bookingservices', 'bookings', 'reviews', 'discounts', 
      'rooms', 'roomtypes', 'services', 'contacts', 'users'
    ];
    for (const table of tables) {
      console.log(`- Đang xóa bảng: ${table}`);
      await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Database đã được dọn dẹp sạch sẽ!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi dọn dẹp Database:', err);
    process.exit(1);
  }
}

resetDatabase();
