const { sendInvoiceEmail } = require('./utils/emailService');

async function test() {
    const success = await sendInvoiceEmail('nt235657@gmail.com', {
        id: 999,
        checkInDate: new Date(),
        checkOutDate: new Date(),
        totalPrice: 2500000,
        room: { roomNumber: 'VIP-99' },
        user: { fullName: 'Thảo Demo' }
    });
    console.log('Test result:', success);
}

test();
