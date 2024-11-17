// const forceDatabaseRefresh = false;

// import dotenv from 'dotenv';
// import express from 'express';
// import routes from './routes/index.js';
// import { sequelize } from './models/index.js';
// import seedAll from './seeds/index.js';

// dotenv.config();

// const app = express();

// const PORT = process.env.PORT || 3001; // Convert to number, default to 3001

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


const forceDatabaseRefresh = true; // Set this to true for first deploy
import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import seedAll from "./seeds/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("../client/dist"));
app.use(express.json());
app.use(routes);

const startServer = async () => {
  try {
    console.log("Starting database sync...");
    await sequelize.sync({ force: forceDatabaseRefresh });
    console.log("Database synced successfully");

    if (forceDatabaseRefresh) {
      console.log("Force refresh enabled, attempting to seed database...");
      await seedAll();
    }

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    // Don't exit process, let Render handle restart if needed
  }
};

startServer();

export default app;