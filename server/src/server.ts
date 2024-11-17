// const forceDatabaseRefresh = false;

// import dotenv from 'dotenv';
// import express from 'express';
// import routes from './routes/index.js';
 import { sequelize } from './models/index.js';
 import seedAll from './seeds/index.js';

// dotenv.config();

// const app = express();

 const PORT = process.env.PORT || 3001; // Convert to number, default to 3001

// // Serves static files in the entire client's dist folder
// app.use(express.static('../client/dist'));

// app.use(express.json());
// app.use(routes);
// await seedAll();

// sequelize.sync({force: forceDatabaseRefresh}).then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
//   });
// });


import fs from "fs/promises";
import path from "path";

const STORAGE_DIR = process.env.STORAGE_PATH || "/var/data";
const INIT_FLAG_FILE = path.join(STORAGE_DIR, ".initialized");

const initializeDatabase = async () => {
  try {
    // Check if we've already initialized
    try {
      await fs.access(INIT_FLAG_FILE);
      console.log("Database already initialized, skipping seeding");
      return;
    } catch {
      // File doesn't exist, continue with initialization
    }

    // Perform initialization
    await sequelize.sync({ force: true });
    console.log("Database synced");

    // Seed the database
    await seedAll();
    //await seedTickets();

    // Create flag file to indicate initialization is complete
    await fs.writeFile(INIT_FLAG_FILE, new Date().toISOString());
    console.log("Database initialized and seeded");
  } catch (error) {
    console.error("Initialization error:", error);
  }
};

const startServer = async () => {
  try {
    // Ensure storage directory exists
    await fs.mkdir(STORAGE_DIR, { recursive: true });

    // Initialize if needed
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

startServer();