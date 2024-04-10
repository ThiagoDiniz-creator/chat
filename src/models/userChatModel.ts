import { connect } from "@/db/dbConfig";
import Chat from "@/models/chatModel";
import User from "@/models/userModel";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
export interface UserChatAttributes {
  idUserChat: number;
  idUser: number;
  idChat: number;
  nameForUser: string;
}

export interface UserChatInput
  extends Optional<UserChatAttributes, "idUserChat"> {}
export interface UserChatOutput extends Required<UserChatAttributes> {}

class UserChat
  extends Model<UserChatAttributes, UserChatInput>
  implements UserChatAttributes
{
  public idUserChat!: number;
  public idUser!: number;
  public idChat!: number;
  public nameForUser!: string;
}

const ATTRIBUTES = {
  idUserChat: {
    type: DataTypes.INTEGER({ length: 11 }),
    primaryKey: true,
    autoIncrement: true,
  },
  idUser: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false,
    references: {
      model: User,
      key: "idUser",
    },
  },
  idChat: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false,
    references: {
      model: Chat,
      key: "idChat",
    },
  },
  nameForUser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const sequelize = connect() as Sequelize;

const OPTIONS = {
  timestamps: false,
  sequelize,
  tableName: "user_chats",
};

// Inicializando o model
UserChat.init(ATTRIBUTES, OPTIONS);

// Sincronizando o domínio
void UserChat.sync();

export default UserChat;
