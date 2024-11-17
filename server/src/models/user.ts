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
  public async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
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
        beforeCreate: async (user: any) => {
          if (!user.getDataValue("password")) {
            throw new Error("Password is required");
          }
          const hashedPassword = await bcrypt.hash(
            user.getDataValue("password"),
            10
          );
          user.setDataValue("password", hashedPassword);
        },
        beforeBulkCreate: async (users: any[]) => {
          for (const user of users) {
            if (!user.getDataValue("password")) {
              throw new Error("Password is required");
            }
            const hashedPassword = await bcrypt.hash(
              user.getDataValue("password"),
              10
            );
            user.setDataValue("password", hashedPassword);
          }
        },
      },
    }
  );

  return User;
}
