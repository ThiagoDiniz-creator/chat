"use client";
import { getImageFullUrl } from "@/libs/image";
import { UserAttributes } from "@/models/userModel";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Configuracoes({
  profile: prevProfile,
}: {
  profile: UserAttributes;
}) {
  const [profile, setProfile] = useState<UserAttributes>(prevProfile);
  const [file, setFile] = useState<File>();

  const refetchProfile = async () => {
    const response = await fetch("/api/users/me");
    const profile = await response.json();
    setProfile(profile.user);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/users/upload-profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Foto de perfil atualizada com sucesso!");
        setInterval(() => {
          refetchProfile();
        }, 300);
      } else {
        toast.error("Erro ao atualizar foto de perfil");
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const imageUrl = useMemo(() => {
    if (!profile.profilePicture) return null;
    return getImageFullUrl(profile.profilePicture);
  }, [profile.profilePicture]);

  return (
    <div className='text-white flex-1 min-h-screen bg-gray-900 p-8'>
      <h1 className='text-3xl font-bold mb-6'>Configurações</h1>

      <p className='mb-4'>
        This is the configurações. You are logged in as{" "}
        <strong>{profile?.username}</strong>.
      </p>

      <div className='mb-6'>
        <p className='mb-2'>Foto de perfil</p>
        {imageUrl ? (
          <>
            <div className='relative w-20 h-20 mb-4'>
              <Image
                src={imageUrl}
                alt='Profile Picture'
                layout='fill'
                objectFit='cover'
                className='rounded-full'
                key={imageUrl}
              />
            </div>
            <form onSubmit={handleSubmit} method='POST'>
              <input
                type='file'
                name='file'
                onChange={e => {
                  setFile(e.target.files?.[0]);
                }}
                title='Selecione sua foto'
                lang='pt-br'
                className='bg-gray-800 text-white py-2 px-4 w-52 rounded file:hidden'
              />
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'
              >
                Enviar
              </button>
            </form>
          </>
        ) : (
          <div className='mb-4'>
            <p className='mb-2'>No profile picture</p>
            <form onSubmit={handleSubmit} method='POST'>
              <input
                type='file'
                name='file'
                onChange={e => {
                  setFile(e.target.files?.[0]);
                }}
                title='Selecione sua foto'
                className='bg-gray-800 text-white py-2 px-4 rounded'
              />
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded'
              >
                Upload
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
