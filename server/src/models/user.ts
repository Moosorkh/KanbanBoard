// import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
// import bcrypt from 'bcrypt';

// interface UserAttributes {
//   id: number;
//   username: string;
//   password: string;
// }

// interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// export class User
//   extends Model<UserAttributes, UserCreationAttributes>
//   implements UserAttributes
// {
//   public id!: number;
//   public username!: string;
//   public password!: string;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   // Instance method to verify password
//   public async verifyPassword(password: string): Promise<boolean> {
//     console.log('Verifying password...');
//     console.log('Input password:', password);
//     console.log('Stored hashed password:', this.password);
    
//     if (!password || !this.password) {
//       console.log('Missing password or stored hash');
//       return false;
//     }

//     try {
//       const isValid = await bcrypt.compare(password, this.password);
//       console.log('Password validation result:', isValid);
//       return isValid;
//     } catch (error) {
//       console.error('Error verifying password:', error);
//       return false;
//     }
//   }
// }

// export function UserFactory(sequelize: Sequelize): typeof User {
//   User.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         get() {
//           return this.getDataValue('password');
//         },
//         set(value: string) {
//           this.setDataValue('password', value);
//         }
//       },
//     },
//     {
//       tableName: "users",
//       sequelize,
//       hooks: {
//         beforeCreate: async (user: any) => {
//           console.log('beforeCreate hook triggered');
//           const password = user.getDataValue('password');
//           console.log('Raw password:', password);
          
//           if (!password) {
//             throw new Error('Password is required');
//           }
          
//           const salt = await bcrypt.genSalt(10);
//           const hashedPassword = await bcrypt.hash(password, salt);
//           console.log('Hashed password:', hashedPassword);
          
//           user.setDataValue('password', hashedPassword);
//         },
//         beforeBulkCreate: async (users: any[]) => {
//           console.log('beforeBulkCreate hook triggered');
//           for (const user of users) {
//             const password = user.getDataValue('password');
//             if (!password) {
//               throw new Error('Password is required');
//             }
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);
//             user.setDataValue('password', hashedPassword);
//           }
//         }
//       }
//     }
//   );

//   return User;
// }

import { DataTypes, Sequelize, Model } from "sequelize";

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
}

export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      sequelize,
    }
  );

  return User;
}