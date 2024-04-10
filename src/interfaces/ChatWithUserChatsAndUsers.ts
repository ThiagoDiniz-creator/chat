import Chat from "@/models/chatModel";
import UserChatWithUser from "./UserChatWithUser";

export default interface ChatWithUserChatsAndUsers extends Chat {
  UserChats: UserChatWithUser[];
}
