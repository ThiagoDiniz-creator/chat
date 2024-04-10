import Configuracoes from "@/components/Configuracoes";
import User, { UserAttributes } from "@/models/userModel";
import { headers } from "next/headers";

export default async function ConfiguracoesPage() {
  const headersList = headers();
  const id = headersList.get("x-user-id");
  if (id === null) return <div>Usuário não encontrado</div>;
  const profile = await User.findByPk(id, { raw: true });

  if (profile === null) {
    return <div>Usuário não encontrado</div>;
  }

  return <Configuracoes profile={profile as UserAttributes} />;
}
