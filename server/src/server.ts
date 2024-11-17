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


const forceDatabaseRefresh = false;
import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import seedAll from "./seeds/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serves static files in the entire client's dist folder
app.use(express.static("../client/dist"));
app.use(express.json());
app.use(routes);

// Modified database sync and seeding logic
sequelize
  .sync({ force: forceDatabaseRefresh })
  .then(async () => {
    try {
      // Only attempt to seed if we're forcing a refresh or it's first deploy
      if (forceDatabaseRefresh) {
        await seedAll().catch((err) => {
          // Log the error but don't throw it
          console.error("Seeding failed but continuing deployment:", err);
        });
      }
    } catch (error) {
      // Log any errors but don't stop the server from starting
      console.error("Database operations error:", error);
    } finally {
      // Always start the server regardless of seeding success
      app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default app;