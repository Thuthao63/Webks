const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Có thể thay bằng smtp khác
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const sendInvoiceEmail = async (userEmail, bookingData) => {
    try {
        const { id, checkInDate, checkOutDate, totalPrice, room, user } = bookingData;
        const customerName = user ? user.fullName : 'Quý khách';
        const roomName = room ? `Phòng ${room.roomNumber}` : 'Phòng tiêu chuẩn';

        const mailOptions = {
            from: `"Uy Nam Luxury Hotel" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Xác nhận đặt phòng thành công - Mã đơn #${id}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                    <h1 style="color: #f59e0b; margin: 0; font-family: 'Times New Roman', serif; font-style: italic;">Uy Nam Luxury</h1>
                    <p style="color: #94a3b8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 10px;">Art of Living</p>
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Xin chào ${customerName},</h2>
                    <p style="color: #64748b; line-height: 1.6;">Cảm ơn bạn đã lựa chọn Uy Nam Luxury Hotel. Đơn đặt phòng của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết:</p>
                    
                    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Chi tiết đặt phòng #${id}</h3>
                        <table style="width: 100%; color: #475569; font-size: 14px;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Hạng phòng:</td>
                                <td style="padding: 8px 0; text-align: right;">${roomName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Ngày nhận phòng:</td>
                                <td style="padding: 8px 0; text-align: right;">${new Date(checkInDate).toLocaleDateString('vi-VN')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Ngày trả phòng:</td>
                                <td style="padding: 8px 0; text-align: right;">${new Date(checkOutDate).toLocaleDateString('vi-VN')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 15px;">Tổng thanh toán:</td>
                                <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #d97706; border-top: 1px solid #e2e8f0; padding-top: 15px;">${formatCurrency(totalPrice)}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #64748b; line-height: 1.6; font-size: 14px;">Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này hoặc gọi hotline 1900-xxxx.</p>
                    <p style="color: #64748b; line-height: 1.6; font-size: 14px;">Trân trọng,<br><strong>Đội ngũ Uy Nam Luxury</strong></p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return false;
    }
};

module.exports = {
    sendInvoiceEmail
};
