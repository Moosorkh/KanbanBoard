import { User } from '../models/user.js';

export const seedUsers = async () => {
  console.log("Starting to seed users...");

  const userData = [
    { username: "JollyGuru", password: "password" },
    { username: "RadiantComet", password: "password" },
    { username: "SunnyScribe", password: "password" },
  ];

  try {
    console.log("Creating users:", userData);
    const users = await User.bulkCreate(userData, { returning: true }); // Add returning: true
    console.log(
      "Seeded users:",
      users.map((user) => user.toJSON())
    ); // Log detailed info
    return users;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

export default seedUsers;