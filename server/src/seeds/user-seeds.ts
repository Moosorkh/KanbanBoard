import { User } from '../models/user.js';

// export const seedUsers = async () => {
//   await User.bulkCreate([
//     { username: 'JollyGuru', password: 'password' },
//     { username: 'SunnyScribe', password: 'password' },
//     { username: 'RadiantComet', password: 'password' },
//   ], { individualHooks: true });
// };

export const seedUsers = async () => {
  const users = [
    { username: "JollyGuru", password: "password" },
    { username: "SunnyScribe", password: "password" },
    { username: "RadiantComet", password: "password" },
  ];

  // Log users for debugging
  console.log("Seeding users:", users);

  await User.bulkCreate(users, { individualHooks: true });
};