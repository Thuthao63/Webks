const db = require('../config/db'); // Giữ nguyên đường dẫn này của Thảo nhé

// 1. [CHO USER] Khách hàng gửi form liên hệ
exports.sendContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Cú pháp chuẩn của Sequelize
    await db.sequelize.query(
      'INSERT INTO contacts (name, email, phone, subject, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, "Pending", NOW(), NOW())',
      { replacements: [name, email, phone, subject, message] }
    );
    res.status(200).json({ message: "Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm." });
  } catch (error) {
    console.error("Lỗi khi lưu liên hệ:", error);
    res.status(500).json({ message: "Lỗi server khi gửi liên hệ", error });
  }
};

// 2. [CHO ADMIN] Lấy toàn bộ danh sách liên hệ để đổ ra bảng
exports.getAllContacts = async (req, res) => {
  try {
    // Cú pháp lấy dữ liệu của Sequelize
    const [contacts] = await db.sequelize.query('SELECT * FROM contacts ORDER BY createdAt DESC'); 
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Lỗi lấy liên hệ:", error);
    res.status(500).json({ message: "Lỗi server khi lấy liên hệ", error });
  }
};

// 3. [CHO ADMIN] Cập nhật trạng thái liên hệ (từ Pending -> Resolved)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.sequelize.query(
      'UPDATE contacts SET status = ? WHERE id = ?', 
      { replacements: [status, id] }
    );
    res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật liên hệ:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật", error });
  }
};