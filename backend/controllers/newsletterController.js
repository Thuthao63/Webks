const Newsletter = require('../models/Newsletter');

const newsletterController = {
    // Đăng ký nhận tin
    subscribe: async (req, res) => {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ message: "Vui lòng cung cấp email." });
            }

            // Kiểm tra trùng lặp
            const existing = await Newsletter.findOne({ where: { email } });
            if (existing) {
                if (existing.status === 'unsubscribed') {
                    existing.status = 'active';
                    await existing.save();
                    return res.status(200).json({ message: "Đăng ký lại thành công!", newsletter: existing });
                }
                return res.status(400).json({ message: "Email này đã được đăng ký trước đó." });
            }

            const newsletter = await Newsletter.create({ email });
            res.status(201).json({ message: "Đăng ký nhận tin thành công!", newsletter });
        } catch (error) {
            console.error("Lỗi khi đăng ký nhận tin:", error);
            res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau.", error: error.message });
        }
    },

    // Lấy danh sách (dành cho Admin)
    getAll: async (req, res) => {
        try {
            const newsletters = await Newsletter.findAll({ order: [['createdAt', 'DESC']] });
            res.status(200).json(newsletters);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách.", error: error.message });
        }
    }
};

module.exports = newsletterController;
