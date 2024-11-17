// import { User } from '../models/user.js';

// export const seedUsers = async () => {
//   await User.bulkCreate([
//     { username: 'JollyGuru', password: 'password' },
//     { username: 'SunnyScribe', password: 'password' },
//     { username: 'RadiantComet', password: 'password' },
//   ], { individualHooks: true });
// };


import { User } from "../models/index.js";

export const seedUsers = async () => {
  console.log("Starting user seeding...");

  const userData = [
    {
      username: "JollyGuru",
      password: "password123",
    },
    {
      username: "RadiantComet",
      password: "password123",
    },
    {
      username: "SunnyScribe",
      password: "password123",
    },
  ];

  try {
    for (const user of userData) {
      await User.create({
        username: user.username,
        password: user.password,
      });
      console.log(`Created user: ${user.username}`);
    }
    console.log("User seeding completed successfully");
  } catch (err) {
    console.error("Error in user seeding:", err);
    throw err;
  }
};

export default seedUsers;