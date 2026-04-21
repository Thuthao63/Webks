const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Import DB Connection
const { connectDB, sequelize } = require('./config/db');

// 2. Import TẤT CẢ Models
const User = require('./models/User');
const RoomType = require('./models/RoomType');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Contact = require('./models/Contact');
const Service = require('./models/Service');
const BookingService = require('./models/BookingService');
const Discount = require('./models/Discount');

// ========================================================
// BỘ NÃO TRUNG TÂM: ĐỊNH NGHĨA QUAN HỆ TRỰC TIẾP
// ========================================================
// Mối quan hệ giữa Phòng và Loại phòng (Cực kỳ quan trọng để hiện danh sách phòng)
Room.belongsTo(RoomType, { foreignKey: 'typeId', as: 'roomType' });
RoomType.hasMany(Room, { foreignKey: 'typeId', as: 'rooms' });

// Mối quan hệ đặt phòng (Booking)
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });

// Mối quan hệ Đánh giá (Review)
Review.belongsTo(User, { foreignKey: 'userId', as: 'reviewer' });
Review.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Mối quan hệ Dịch vụ đi kèm đơn hàng
Booking.belongsToMany(Service, { through: BookingService, foreignKey: 'bookingId', as: 'services' });
Service.belongsToMany(Booking, { through: BookingService, foreignKey: 'serviceId', as: 'bookings' });

// Mối quan hệ Giảm giá
Discount.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });
RoomType.hasMany(Discount, { foreignKey: 'roomTypeId', as: 'discounts' });

// ========================================================
// 3. KHỞI TẠO EXPRESS & MIDDLEWARE
// ========================================================
const app = express();
app.use(cors());
app.use(express.json());

// Cung cấp thư mục ảnh để Frontend có thể truy cập được
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. ĐỊNH NGHĨA ROUTES
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const discountRoutes = require('./routes/discountRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/discounts', discountRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Hệ thống Backend Khách sạn Uy Nam đang sẵn sàng!');
});

// ========================================================
// 5. KHỞI ĐỘNG SERVER & ĐỒNG BỘ DATABASE
// ========================================================
const startServer = async () => {
    try {
        // Kết nối cơ sở dữ liệu
        await connectDB();
        
        console.log('🔄 Đang đồng bộ cấu trúc Database...');
        // alter: true giúp cập nhật bảng mà không mất dữ liệu cũ
        await sequelize.sync({ alter: true });
        console.log('✨ Database đã sẵn sàng với đầy đủ quan hệ bảng!');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`📡 SERVER ĐANG CHẠY TẠI: http://localhost:${PORT}`);
            console.log(`✅ Thảo có thể test API tại: http://localhost:${PORT}/api/rooms`);
        });
    } catch (err) {
        console.error('❌ Lỗi khởi động hệ thống:', err);
        process.exit(1);
    }
};

startServer();