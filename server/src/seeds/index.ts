// import { seedUsers } from './user-seeds.js';
// import { seedTickets } from './ticket-seeds.js';
// import { sequelize } from '../models/index.js';

// const seedAll = async (): Promise<void> => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log('\n----- DATABASE SYNCED -----\n');
    
//     await seedUsers();
//     console.log('\n----- USERS SEEDED -----\n');
    
//     await seedTickets();
//     console.log('\n----- TICKETS SEEDED -----\n');
    
//     process.exit(0);
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     process.exit(1);
//   }
// };

// export default seedAll;

import { seedUsers } from "./user-seeds.js";
import { seedTickets } from "./ticket-seeds.js";
import { sequelize } from "../models/index.js";

const seedAll = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true });
    console.log("\n----- DATABASE SYNCED -----\n");

    // Check if users already exist
    const userCount = await sequelize.models.User.count();
    if (userCount === 0) {
      await seedUsers();
      console.log("\n----- USERS SEEDED -----\n");
    } else {
      console.log("\n----- USERS ALREADY EXIST -----\n");
    }

    // Check if tickets already exist
    const ticketCount = await sequelize.models.Ticket.count();
    if (ticketCount === 0) {
      await seedTickets();
      console.log("\n----- TICKETS SEEDED -----\n");
    } else {
      console.log("\n----- TICKETS ALREADY EXIST -----\n");
    }

    // Don't exit the process anymore
    return;
  } catch (error) {
    console.error("Error seeding database:", error);
    // Don't throw the error, just log it
    return;
  }
};

export default seedAll;