import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
// import seedAll from "./seeds/index.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) || 3000;

app.use(express.json());
app.use(express.static("../client/dist"));
app.use(routes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const startServer = async () => {
  try {
    console.log("Starting database sync...");
    await sequelize.sync(); // No { force: true } for production

    // Uncomment this only if the database isn't seeded
    // console.log("Seeding database...");
    // await seedAll();
    // console.log("Seeding completed.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Startup error:", error.message, error.stack);
    } else {
      console.error("Startup error:", error);
    }
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
