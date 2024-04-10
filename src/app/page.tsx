import Link from "next/link";

export default function Home() {
  return (
    <main className='bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold mb-4'>Seja bem-vindo ao NextChat</h1>
      <h2 className='text-lg mb-6'>
        O chat em tempo real que te permite conversar com qualquer pessoa!
      </h2>

      <p className='mb-8'>
        Para começar, você deve criar uma conta ou entrar em uma existente.
      </p>

      <div className='flex space-x-4'>
        <Link
          href='/sign-in'
          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800'
        >
          Entrar
        </Link>
        <Link
          href='/sign-up'
          className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-green active:bg-green-800'
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}
