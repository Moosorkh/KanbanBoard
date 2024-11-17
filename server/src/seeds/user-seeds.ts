import { User } from '../models/user.js';

// export const seedUsers = async () => {
//   await User.bulkCreate([
//     { username: 'JollyGuru', password: 'password' },
//     { username: 'SunnyScribe', password: 'password' },
//     { username: 'RadiantComet', password: 'password' },
//   ], { individualHooks: true });
// };

export const seedUsers = async () => {
  const existingUsers = await User.findAll();
  if (existingUsers.length > 0) {
    console.log("Users already seeded. Skipping...");
    return;
  }

  const users = [
    { username: "JollyGuru", password: "password" },
    { username: "SunnyScribe", password: "password" },
    { username: "RadiantComet", password: "password" },
  ];
  try {
    console.log("Creating users...");
    await User.bulkCreate(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

export default seedUsers;