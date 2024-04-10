import { connect } from "@/db/dbConfig";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface ChatAttributes {
  idChat: number;
  lastActive: Date;
}

export interface ChatInput extends Optional<ChatAttributes, "idChat"> {}
export interface ChatOutput extends Required<ChatAttributes> {}

class Chat extends Model<ChatAttributes, ChatInput> implements ChatAttributes {
  public idChat!: number;
  public lastActive!: Date;
}

const ATTRIBUTES = {
  idChat: {
    type: DataTypes.INTEGER({ length: 11 }),
    primaryKey: true,
    autoIncrement: true,
  },
  lastActive: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

const sequelize = connect() as Sequelize;

const OPTIONS = {
  timestamps: false,
  sequelize,
  tableName: "chats",
};

// Inicializando o model
Chat.init(ATTRIBUTES, OPTIONS);

// Sincronizando o domínio
void Chat.sync();

export default Chat;
