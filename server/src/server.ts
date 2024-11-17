import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
//import seedAll from "./seeds/index.js";

dotenv.config();

const app = express();
// Use Render's PORT environment variable or fallback to 3000
const PORT = parseInt(process.env.PORT as string, 10) || 3000;

// Middleware
app.use(express.json());
app.use(express.static("../client/dist"));
app.use(routes);

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const startServer = async () => {
  try {
    // Force sync and seed
    console.log("Starting database sync with force...");
    await sequelize.sync({ force: true });
    console.log("Database synced, starting seeding...");

    //await seedAll();
    console.log("Seeding completed");

    // Start the server and log the port explicitly
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at http://0.0.0.0:${PORT}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      console.error("Server error:", error);
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
