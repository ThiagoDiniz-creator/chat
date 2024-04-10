import { connect } from "@/db/dbConfig";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface UserAttributes {
  idUser: number;
  username: string;
  email: string;
  profilePicture: string | null;
  password: string;
}

export interface UserInput extends Optional<UserAttributes, "idUser"> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public idUser!: number;
  public username!: string;
  public email!: string;
  public profilePicture!: string | null;
  public password!: string;
}

const ATTRIBUTES = {
  idUser: {
    type: DataTypes.INTEGER({ length: 11 }),
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING({ length: 60 }),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING({ length: 64 }),
    allowNull: false,
    unique: true,
  },
  profilePicture: {
    type: DataTypes.STRING({ length: 255 }),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING({ length: 80 }),
    allowNull: false,
  },
};

const sequelize = connect() as Sequelize;

const OPTIONS = {
  timestamps: false,
  sequelize,
  tableName: "users",
};

// Inicializando o model
User.init(ATTRIBUTES, OPTIONS);

// Sincronizando o domínio
void User.sync();

export default User;
