const { sequelize } = require('../config/db');

async function migrateDiscounts() {
    try {
        console.log('Đang chạy script cập nhật database...');
        
        // Kiểm tra xem bảng discounts đã có cột code chưa
        const [results] = await sequelize.query(`SHOW COLUMNS FROM discounts LIKE 'code'`);
        if (results.length === 0) {
            console.log('Thêm cột code vào bảng discounts...');
            await sequelize.query('ALTER TABLE discounts ADD COLUMN code VARCHAR(50) DEFAULT NULL');
            console.log('Đã thêm cột code thành công!');

            // Cập nhật các bản ghi cũ để có mã sinh ngẫu nhiên
            console.log('Đang cập nhật các bản ghi cũ với mã ngẫu nhiên...');
            await sequelize.query(`
                UPDATE discounts 
                SET code = CONCAT('OLD', id, SUBSTRING(MD5(RAND()), 1, 4))
                WHERE code IS NULL
            `);
            
            // Alter column to not null and add unique constraint
            await sequelize.query('ALTER TABLE discounts MODIFY COLUMN code VARCHAR(50) NOT NULL');
            await sequelize.query('ALTER TABLE discounts ADD UNIQUE (code)');

            console.log('Cập nhật bản ghi cũ và constraint thành công!');
        } else {
            console.log('Cột code đã tồn tại trong bảng discounts.');
        }

    } catch (err) {
        console.error('Lỗi khi cập nhật database:', err);
    } finally {
        process.exit();
    }
}

migrateDiscounts();
