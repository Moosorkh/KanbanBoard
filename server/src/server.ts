const forceDatabaseRefresh = false;

import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();
// const PORT = parseInt(process.env.PORT || '3001', 10);

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// }
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // Convert to number, default to 3001

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));

app.use(express.json());
app.use(routes);

sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
