require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../config/db');

async function run() {
    try {
        console.log("Starting DB script...");
        
        // Ensure DB is connected
        await sequelize.authenticate();
        console.log("DB connected.");

        // Check if roomTypeId exists
        const [results] = await sequelize.query("SHOW COLUMNS FROM `services` LIKE 'roomTypeId'");
        if (results.length === 0) {
            console.log("Column roomTypeId does not exist. Adding it...");
            await sequelize.query("ALTER TABLE `services` ADD COLUMN `roomTypeId` INT");
            
            // Get first roomTypeId
            const [roomTypes] = await sequelize.query("SELECT id FROM `roomtypes` LIMIT 1");
            let defaultRoomTypeId = 1;
            if (roomTypes.length > 0) {
                defaultRoomTypeId = roomTypes[0].id;
            }

            console.log(`Setting default roomTypeId to ${defaultRoomTypeId} for existing services...`);
            await sequelize.query(`UPDATE \`services\` SET \`roomTypeId\` = ${defaultRoomTypeId}`);

            console.log("Modifying column to NOT NULL and adding foreign key...");
            await sequelize.query("ALTER TABLE `services` MODIFY COLUMN `roomTypeId` INT NOT NULL");
            await sequelize.query("ALTER TABLE `services` ADD CONSTRAINT `fk_services_roomtypes` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE");
            console.log("Done adding roomTypeId column.");
        } else {
            console.log("Column roomTypeId already exists.");
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit();
    }
}

run();
