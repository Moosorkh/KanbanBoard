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

import seedUsers from "./user-seeds.js";
import { seedTickets } from "./ticket-seeds.js";
import { sequelize } from "../models/index.js";

const seedAll = async (): Promise<void> => {
  console.log("Starting database seeding process...");

  try {
    // Check existing data
    const userCount = await sequelize.models.User.count();
    const ticketCount = await sequelize.models.Ticket.count();

    console.log(
      `Current database state - Users: ${userCount}, Tickets: ${ticketCount}`
    );

    if (userCount === 0) {
      console.log("No users found, starting user seeding...");
      try {
        await seedUsers();
        const newUserCount = await sequelize.models.User.count();
        console.log(
          `Users seeded successfully. New user count: ${newUserCount}`
        );
      } catch (userError) {
        console.error("Error seeding users:", userError);
      }
    }

    // Only seed tickets if we have users
    const finalUserCount = await sequelize.models.User.count();
    if (finalUserCount > 0 && ticketCount === 0) {
      console.log("Starting ticket seeding...");
      try {
        await seedTickets();
        const newTicketCount = await sequelize.models.Ticket.count();
        console.log(
          `Tickets seeded successfully. New ticket count: ${newTicketCount}`
        );
      } catch (ticketError) {
        console.error("Error seeding tickets:", ticketError);
      }
    }

    console.log("Seeding process completed");
  } catch (error) {
    console.error("Error during seeding process:", error);
  }
};

export default seedAll;