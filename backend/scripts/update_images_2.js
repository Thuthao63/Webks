const { connectDB, sequelize } = require('../config/db');
const Article = require('../models/Article');

async function updateImages() {
    try {
        await connectDB();

        await Article.update(
            { thumbnail: '/uploads/phu_quoc_beach.png' },
            { where: { slug: 'kinh-nghiem-du-lich-phu-quoc-3-ngay-2-dem' } }
        );

        await Article.update(
            { thumbnail: '/uploads/mien_trung_beach.png' },
            { where: { slug: 'top-5-bai-bien-dep-nhat-mien-trung' } }
        );

        console.log("Đã cập nhật hình ảnh thành công!");
    } catch (error) {
        console.error("Lỗi khi cập nhật hình ảnh:", error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

updateImages();
