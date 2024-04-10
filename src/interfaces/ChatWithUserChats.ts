import Chat from "@/models/chatModel";
import UserChat from "@/models/userChatModel";

export default interface ChatWithUserChats extends Chat {
  UserChats: UserChat[];
}
