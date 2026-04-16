const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'bi_mat_khach_san_uy_nam', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token không hợp lệ!' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Chưa được xác thực!' });
    }
};

module.exports = { verifyToken };
