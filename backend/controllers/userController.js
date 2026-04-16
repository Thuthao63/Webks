const User = require('../models/User');
const Booking = require('../models/Booking');

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Lỗi lấy danh sách User:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
    }
};

// Cập nhật phân quyền người dùng
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['Customer', 'Receptionist', 'Admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Role không hợp lệ!' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Cập nhật quyền thành công!', user: { id: user.id, role: user.role } });
    } catch (error) {
        console.error("❌ Lỗi cập nhật Role:", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật phân quyền.' });
    }
};

// Xóa người dùng (Chặn xóa nếu đã có booking)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
        }

        // Kiểm tra xem user có booking nào không
        const bookingCount = await Booking.count({ where: { userId: id } });
        if (bookingCount > 0) {
            return res.status(400).json({ message: 'Không thể xóa người dùng này do họ đã có lịch sử đặt phòng!' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Đã xóa người dùng thành công!' });
    } catch (error) {
        console.error("❌ Lỗi xóa User:", error);
        res.status(500).json({ message: 'Lỗi server khi xóa người dùng.' });
    }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
