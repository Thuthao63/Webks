const Room = require('./models/Room');
const RoomType = require('./models/RoomType');
const { sequelize } = require('./config/db');

async function check() {
    try {
        await sequelize.authenticate();
        const rooms = await Room.findAll();
        const types = await RoomType.findAll();
        console.log(`Current rooms: ${rooms.length}`);
        console.log('Room Types:');
        types.forEach(t => console.log(`- ${t.id}: ${t.name}`));
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

check();
