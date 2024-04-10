"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/users/sign-up", {
      body: JSON.stringify({
        email,
        password,
        username,
      }),
      method: "POST",
    });

    if (response.status === 200) {
      toast.success("Conta criada com sucesso!");
      router.push("/sign-in");
    } else {
      const jsonResponse = await response.json();
      toast.error("Erro ao criar conta: " + jsonResponse.error);
    }
  };

  return (
    <main className='bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold mb-6'>Criar conta</h1>

      <form className='flex flex-col max-w-md' onSubmit={handleSignUp}>
        <label htmlFor='email' className='text-lg mb-2'>
          E-mail
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='bg-gray-800 text-white w-full py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline-blue'
        />

        <label htmlFor='username' className='text-lg mb-2'>
          Nome
        </label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={e => setUsername(e.target.value)}
          className='bg-gray-800 text-white w-full py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline-blue'
        />

        <label htmlFor='password' className='text-lg mb-2'>
          Senha
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='bg-gray-800 text-white w-full py-2 px-4 mb-6 rounded focus:outline-none focus:shadow-outline-blue'
        />

        <button
          type='submit'
          disabled={pending}
          className={`bg-blue-500 ${
            pending ? "cursor-not-allowed" : "hover:bg-blue-600"
          } text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800`}
        >
          Criar conta
        </button>
      </form>
    </main>
  );
}
