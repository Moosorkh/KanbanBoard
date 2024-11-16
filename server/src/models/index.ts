import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

// Create Sequelize instance using the URL
const sequelize = new Sequelize(databaseUrl!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Important for Render's SSL connection
    }
  },
  logging: false // Set to true for debugging
});

const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

export { sequelize, User, Ticket };
