const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');

// Cấu hình gửi Email (Nên dùng App Password của Google)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- 1. HÀM ĐĂNG KÝ ---
const register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: 'Email này đã được đăng ký!' });

        // Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu User vào Database
        await User.create({ 
            fullName, 
            email, 
            password, // Lưu ý: Trong thực tế nên dùng bcrypt để mã hóa mật khẩu ở đây
            phone: phone || '', 
            verificationCode: otp 
        });

        // Gửi mã OTP qua Email
        const mailOptions = {
            from: `"Khách sạn Uy Nam" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Xác thực tài khoản Uy Nam Luxury',
            html: `
                <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
                    <h2 style="color: #3b82f6;">Uy Nam Luxury Hotel</h2>
                    <p>Chào <b>${fullName}</b>,</p>
                    <p>Mã xác thực tài khoản (OTP) của bạn là:</p>
                    <h1 style="color: #3b82f6; letter-spacing: 5px;">${otp}</h1>
                    <p>Mã này có hiệu lực trong 10 phút. Đừng chia sẻ mã này với bất kỳ ai.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.' });
    } catch (error) {
        console.error("❌ Lỗi đăng ký:", error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
    }
};

// --- 2. HÀM XÁC THỰC OTP ---
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || user.verificationCode !== otp) {
            return res.status(400).json({ message: 'Mã OTP không chính xác hoặc đã hết hạn!' });
        }

        // Cập nhật trạng thái đã xác thực
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ message: 'Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.' });
    } catch (error) {
        console.error("❌ Lỗi xác thực OTP:", error);
        res.status(500).json({ message: 'Lỗi hệ thống khi xác thực.' });
    }
};

// --- 3. HÀM ĐĂNG NHẬP ---
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        // Kiểm tra tài khoản
        if (!user) return res.status(404).json({ message: 'Email này chưa được đăng ký!' });
        if (user.password !== password) return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
        if (!user.isVerified) return res.status(403).json({ message: 'Tài khoản chưa được xác thực email!' });

        // Tạo mã Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'bi_mat_khach_san_uy_nam',
            { expiresIn: '1d' }
        );

        // Trả về dữ liệu cho Frontend (Map fullName sang username để Frontend không bị lỗi hiển thị)
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token,
            user: { 
                id: user.id, 
                fullName: user.fullName,
                username: user.fullName, 
                email: user.email, 
                role: user.role,
                phone: user.phone || '',
                address: user.address || ''
            }
        });
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
};

// --- 4. HÀM CẬP NHẬT THÔNG TIN CÁ NHÂN ---
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phone, address } = req.body;

        // Cập nhật Database (Map username từ Frontend về fullName trong DB)
        await User.update(
            { fullName: username, phone, address },
            { where: { id } }
        );

        // Lấy lại dữ liệu sau khi cập nhật để trả về cho Frontend
        const updatedUser = await User.findByPk(id);

        res.status(200).json({
            message: "Cập nhật thành công!",
            user: {
                id: updatedUser.id,
                fullName: updatedUser.fullName,
                username: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("❌ Lỗi cập nhật User:", error);
        res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật thông tin.' });
    }
};

module.exports = { register, verifyOTP, login, updateUser };