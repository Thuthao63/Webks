const { sequelize } = require('./config/db');
const Room = require('./models/Room');
const RoomType = require('./models/RoomType');

/**
 * Script seed idempotent:
 * - Tạo 3 RoomType nếu chưa có
 * - Tạo 20 Room, gán typeId luân phiên
 * - Sử dụng findOrCreate để có thể chạy nhiều lần an toàn
 */
async function seed() {
  const t = await sequelize.transaction();
  try {
    // 1. Tạo RoomTypes
    const typesData = [
      { key: 'Deluxe', name: 'Deluxe', price: 2000000, capacity: 2, image: '/Hinh anh/Hinh1.png', description: 'Phòng Deluxe' },
      { key: 'Premium', name: 'Premium', price: 3500000, capacity: 3, image: '/Hinh anh/Hinh8.png', description: 'Phòng Premium' },
      { key: 'Suite', name: 'Suite', price: 6000000, capacity: 4, image: '/Hinh anh/Hinh15.png', description: 'Phòng Suite' }
    ];

    const createdTypes = [];
    for (const td of typesData) {
      const [type] = await RoomType.findOrCreate({
        where: { name: td.name },
        defaults: { price: td.price, capacity: td.capacity, image: td.image, description: td.description },
        transaction: t
      });
      createdTypes.push(type);
      console.log(`Ensured RoomType: ${type.name} (id=${type.id})`);
    }

    // 2. Tạo 20 phòng gán ảnh từ Hinh1..Hinh20
    const totalRooms = 20;
    for (let i = 1; i <= totalRooms; i++) {
      const roomNumber = (100 + i).toString();
      // luân phiên typeId
      const type = createdTypes[(i - 1) % createdTypes.length];
      const imagePath = `/Hinh anh/Hinh${i}.png`;

      const [room, created] = await Room.findOrCreate({
        where: { roomNumber },
        defaults: { roomNumber, status: 'Available', typeId: type.id },
        transaction: t
      });

      if (created) {
        console.log(`Created room ${roomNumber} -> type ${type.name}`);
      } else {
        // ensure typeId is set correctly if it existed but type changed
        if (room.typeId !== type.id) {
          room.typeId = type.id;
          await room.save({ transaction: t });
          console.log(`Updated room ${roomNumber} type -> ${type.name}`);
        } else {
          console.log(`Room ${roomNumber} already exists`);
        }
      }
    }

    await t.commit();
    console.log('Seeding finished successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    await t.rollback();
  } finally {
    await sequelize.close();
  }
}

seed();
