const Room = require('./models/Room');
const { sequelize } = require('./config/db');

async function addRooms() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const newRooms = [
            { roomNumber: '103', typeId: 1, status: 'Available' },
            { roomNumber: '104', typeId: 1, status: 'Available' },
            { roomNumber: '105', typeId: 1, status: 'Available' },
            { roomNumber: '203', typeId: 2, status: 'Available' },
            { roomNumber: '204', typeId: 2, status: 'Available' },
            { roomNumber: '205', typeId: 2, status: 'Available' },
            { roomNumber: '303', typeId: 3, status: 'Available' },
            { roomNumber: '304', typeId: 3, status: 'Available' },
            { roomNumber: '305', typeId: 3, status: 'Available' },
            { roomNumber: '401', typeId: 1, status: 'Available' },
            { roomNumber: '402', typeId: 2, status: 'Available' },
            { roomNumber: '403', typeId: 3, status: 'Available' },
            { roomNumber: '501', typeId: 1, status: 'Available' },
            { roomNumber: '502', typeId: 2, status: 'Available' }
        ];

        for (const r of newRooms) {
            await Room.create(r);
            console.log(`Created room ${r.roomNumber}`);
        }

        console.log('Finished adding rooms.');
    } catch (e) {
        console.error('Error adding rooms:', e);
    } finally {
        await sequelize.close();
    }
}

addRooms();
