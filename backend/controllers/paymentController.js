const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');
const Booking = require('../models/Booking');

// VNPay Config (Sandbox)
const vnp_TmnCode = "DUMMY123"; 
const vnp_HashSecret = "DUMMYSECRETKEY1234567890ABCDEFGH";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:5173/payment-result"; // Frontend URL

const paymentController = {
    createPaymentUrl: async (req, res) => {
        try {
            const { bookingId, amount } = req.body;
            let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
            
            // Xử lý ipAddr nếu là mảng hoặc IPv6 localhost
            if (Array.isArray(ipAddr)) ipAddr = ipAddr[0];
            if (ipAddr === '::1') ipAddr = '127.0.0.1';

            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');
            const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');

            const orderId = `${bookingId}_${moment(date).format('HHmmss')}`;

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan don phong ' + bookingId;
            vnp_Params['vnp_OrderType'] = 'billpayment';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_ExpireDate'] = expireDate;

            // Sort keys ascending
            vnp_Params = sortObject(vnp_Params);

            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;

            const paymentUrl = vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

            res.status(200).json({ paymentUrl });
        } catch (error) {
            console.error("Lỗi tạo URL thanh toán:", error);
            res.status(500).json({ message: "Lỗi tạo URL thanh toán" });
        }
    },

    vnpayReturn: async (req, res) => {
        try {
            let vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

            const rspCode = vnp_Params['vnp_ResponseCode'];
            const orderIdStr = vnp_Params['vnp_TxnRef']; 
            const bookingId = orderIdStr.split('_')[0];

            if (secureHash === signed) {
                if (rspCode === "00") {
                    await Booking.update({ status: 'confirmed' }, { where: { id: bookingId } });
                    res.status(200).json({ code: rspCode, message: 'Thanh toán thành công' });
                } else {
                    await Booking.update({ status: 'cancelled' }, { where: { id: bookingId } });
                    res.status(200).json({ code: rspCode, message: 'Thanh toán thất bại' });
                }
            } else {
                res.status(400).json({ code: '97', message: 'Chữ ký không hợp lệ' });
            }
        } catch (error) {
            console.error("Lỗi IPN:", error);
            res.status(500).json({ message: "Lỗi xử lý kết quả thanh toán" });
        }
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = paymentController;
