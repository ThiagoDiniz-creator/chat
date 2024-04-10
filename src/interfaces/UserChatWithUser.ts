import UserChat from "@/models/userChatModel";
import User from "@/models/userModel";

export default interface UserChatWithUser extends UserChat {
  User: User;
}
