const cron = require('node-cron');
const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

const startCronJobs = () => {
    // Chạy mỗi giờ một lần (hoặc có thể chỉnh thành '0 12 * * *' để chạy đúng 12h trưa mỗi ngày)
    // Để cho mục đích test, chạy mỗi phút một lần: '* * * * *'
    // Nhưng thực tế nên chạy mỗi giờ: '0 * * * *'
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('[CRON] Đang quét hệ thống để tự động trả phòng...');
            const today = new Date();
            // Đặt thời gian về 00:00:00 để so sánh đúng ngày
            today.setHours(0, 0, 0, 0);

            // Tìm các đơn đặt phòng đã qua ngày trả phòng (checkOutDate < today) và đang ở trạng thái confirmed
            const expiredBookings = await Booking.findAll({
                where: {
                    status: 'confirmed',
                    checkOutDate: {
                        [Op.lt]: today
                    }
                }
            });

            if (expiredBookings.length > 0) {
                for (let booking of expiredBookings) {
                    // 1. Cập nhật trạng thái đơn thành completed
                    booking.status = 'completed';
                    await booking.save();

                    // 2. Cập nhật phòng thành Available
                    const room = await Room.findByPk(booking.roomId);
                    if (room && room.status !== 'Available') {
                        room.status = 'Available';
                        await room.save();
                    }
                    console.log(`[CRON] Đã tự động trả phòng: Đơn ${booking.id}, Phòng ${booking.roomId}`);
                }
            } else {
                console.log('[CRON] Không có phòng nào đến hạn trả hôm nay.');
            }
        } catch (error) {
            console.error('[CRON] Lỗi khi chạy tự động trả phòng:', error);
        }
    });
};

module.exports = { startCronJobs };
