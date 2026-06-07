require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../config/db');

async function run() {
    try {
        console.log("Starting DB migration script for services...");
        
        await sequelize.authenticate();
        console.log("DB connected.");

        // Check if roomTypeId exists
        const [results] = await sequelize.query("SHOW COLUMNS FROM `services` LIKE 'roomTypeId'");
        if (results.length > 0) {
            console.log("Column roomTypeId exists. Dropping foreign key and column...");
            
            // Step 1: Get data to preserve
            const [servicesData] = await sequelize.query("SELECT id, roomTypeId FROM `services`");

            // Step 2: Drop foreign key constraint
            try {
                await sequelize.query("ALTER TABLE `services` DROP FOREIGN KEY `fk_services_roomtypes`");
            } catch (e) {
                console.log("Foreign key fk_services_roomtypes might not exist or has a different name, ignoring...");
            }
            // Another try if the constraint name is different
            try {
                await sequelize.query("ALTER TABLE `services` DROP FOREIGN KEY `services_ibfk_1`");
            } catch (e) {
                console.log("Foreign key services_ibfk_1 might not exist, ignoring...");
            }

            // Step 3: Drop column roomTypeId
            try {
                await sequelize.query("ALTER TABLE `services` DROP COLUMN `roomTypeId`");
            } catch(e) {
                console.log("Error dropping column: ", e);
            }
            
            // Step 4: Add new column applicableRoomTypes
            await sequelize.query("ALTER TABLE `services` ADD COLUMN `applicableRoomTypes` JSON");
            
            // Step 5: Restore data into new column
            for (const service of servicesData) {
                const rtId = service.roomTypeId;
                if (rtId) {
                    const jsonArrStr = JSON.stringify([rtId]);
                    await sequelize.query(`UPDATE \`services\` SET \`applicableRoomTypes\` = '${jsonArrStr}' WHERE \`id\` = ${service.id}`);
                } else {
                    await sequelize.query(`UPDATE \`services\` SET \`applicableRoomTypes\` = '[]' WHERE \`id\` = ${service.id}`);
                }
            }
            
            console.log("Migration complete: converted roomTypeId to applicableRoomTypes JSON array.");
        } else {
            console.log("Column roomTypeId does not exist, checking applicableRoomTypes...");
            const [results2] = await sequelize.query("SHOW COLUMNS FROM `services` LIKE 'applicableRoomTypes'");
            if (results2.length === 0) {
                 await sequelize.query("ALTER TABLE `services` ADD COLUMN `applicableRoomTypes` JSON");
                 await sequelize.query("UPDATE `services` SET `applicableRoomTypes` = '[]'");
                 console.log("Added applicableRoomTypes JSON column.");
            } else {
                 console.log("applicableRoomTypes already exists. Nothing to do.");
            }
        }
    } catch (e) {
        console.error("Migration Error:", e);
    } finally {
        process.exit();
    }
}

run();
