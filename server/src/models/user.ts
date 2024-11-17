import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Hash the password before saving the user
  // public async setPassword(password: string) {
  //   const saltRounds = 10;
  //   this.password = await bcrypt.hash(password, saltRounds);
  // }
  public async setPassword(password: string) {
    const saltRounds = 10;
    console.log("Hashing password:", password);
    this.password = await bcrypt.hash(password, saltRounds);
    console.log("Hashed password:", this.password);
  }
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
      hooks: {
        beforeCreate: async (user: User) => {
          console.log("Before Create Hook - User:", user);
          if (!user.password) {
            throw new Error("Password is required for user creation");
          }
          await user.setPassword(user.password);
          console.log("Password hashed for user:", user.username);
        },
        beforeUpdate: async (user: User) => {
          if (!user.password) {
            throw new Error("Password is required for user update");
          }
          await user.setPassword(user.password);
        },
      },
      // hooks: {
      //   beforeCreate: async (user: User) => {
      //     // await user.setPassword(user.password);
      //     if(user.password) {
      //       throw new Error("Password is required for user creation");
      //     }
      //     console.log("User created:", user.username);
      //     await user.setPassword(user.password);
      //   },
      //   beforeUpdate: async (user: User) => {
      //     await user.setPassword(user.password);
      //   },
      // }
    }
  );

  return User;
}
