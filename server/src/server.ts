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
    // Force sync and seed
    console.log("Starting database sync with force...");
    await sequelize.sync({ force: true });
    console.log("Database synced, starting seeding...");

    await seedAll();
    console.log("Seeding completed");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
  }
};

startServer();

export default app;

// await seedAll();

// sequelize.sync({force: forceDatabaseRefresh}).then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
//   });
// });
