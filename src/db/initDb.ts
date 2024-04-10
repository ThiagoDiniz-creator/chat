import Chat from "@/models/chatModel";
import Message from "@/models/messageModel";
import UserChat from "@/models/userChatModel";
import User from "@/models/userModel";

export default async function initDb() {
  User.hasMany(UserChat, {
    foreignKey: "idUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  UserChat.belongsTo(User, {
    foreignKey: "idUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Chat.hasMany(Message, {
    foreignKey: "idChat",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Message.belongsTo(Chat, {
    foreignKey: "idUserChat",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  UserChat.hasMany(Message, {
    foreignKey: "idUserChat",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Chat.hasMany(UserChat, {
    foreignKey: "idChat",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  UserChat.belongsTo(Chat, {
    foreignKey: "idChat",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "usersChat",
  });

  await User.sync();
  await Chat.sync();
  await UserChat.sync();
  await Message.sync();
}
