import { connect } from "@/db/dbConfig";
import Chat from "@/models/chatModel";
import User from "@/models/userModel";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
export interface MessageAttributes {
  idMessage: number;
  idChat: number;
  idUser: number;
  content: string;
  status: "SENT" | "SERVER" | "SEEN";
  sent: Date;
}

export interface MessageInput
  extends Optional<MessageAttributes, "idMessage"> {}
export interface MessageOutput extends Required<MessageAttributes> {}

class Message
  extends Model<MessageAttributes, MessageInput>
  implements MessageAttributes
{
  public idMessage!: number;
  public idChat!: number;
  public idUser!: number;
  public content!: string;
  public status!: "SENT" | "SERVER" | "SEEN";
  public sent!: Date;
}

const ATTRIBUTES = {
  idMessage: {
    type: DataTypes.INTEGER({ length: 11 }),
    primaryKey: true,
    autoIncrement: true,
  },
  idChat: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false,
    references: {
      model: Chat,
      key: "idChat",
    },
  },
  idUser: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false,
    references: {
      model: User,
      key: "idUser",
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("SENT", "SERVER", "SEEN"),
    allowNull: false,
    defaultValue: "SENT",
  },
  sent: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
};

const sequelize = connect() as Sequelize;

const OPTIONS = {
  timestamps: false,
  sequelize,
  tableName: "messages",
};

// Inicializando o model
Message.init(ATTRIBUTES, OPTIONS);

// Sincronizando o domínio
void Message.sync();

export default Message;
