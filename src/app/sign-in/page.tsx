"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/users/sign-in", {
      body: JSON.stringify({
        email,
        password,
      }),
      method: "POST",
    });

    if (response.status === 200) {
      toast.success("Logado com sucesso!");
      router.push("/homepage");
    } else {
      const jsonResponse = await response.json();
      toast.error("Erro ao logar: " + jsonResponse.error);
    }
  };

  return (
    <main className='bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold mb-6'>Entrar</h1>

      <form className='flex flex-col items-center' onSubmit={handleSignIn}>
        <label htmlFor='email' className='text-lg mb-2'>
          E-mail
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={event => setEmail(event.target.value)}
          className='bg-gray-800 text-white w-full py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline-blue'
        />

        <label htmlFor='password' className='text-lg mb-2'>
          Senha
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={event => setPassword(event.target.value)}
          className='bg-gray-800 text-white w-full py-2 px-4 mb-6 rounded focus:outline-none focus:shadow-outline-blue'
        />

        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800'
        >
          Entrar
        </button>
      </form>

      <p className='mt-4'>
        Não tem uma conta?{" "}
        <Link href='/sign-up' className='text-blue-500 hover:underline'>
          Crie uma!
        </Link>
      </p>
    </main>
  );
}
