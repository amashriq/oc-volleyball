"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
  }

  return (
    <main className='min-h-screen flex items-center justify-center px-5 md:px-10'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-md p-8 md:p-10'>
        <div className='w-10 h-1 bg-red-700 mb-4' />

        <h1 className='text-3xl font-black uppercase tracking-tighter text-gray-900 border-b border-gray-100 pb-4 mb-6'>
          Login
        </h1>

        <form onSubmit={handleLogin} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-bold uppercase text-gray-400 tracking-widest'>
              Email
            </label>
            <input
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-shadow duration-200'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-bold uppercase text-gray-400 tracking-widest'>
              Password
            </label>
            <input
              placeholder='••••••••'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-shadow duration-200'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-widest py-3 rounded-lg transition-colors duration-200 cursor-pointer mt-1'
          >
            Login
          </button>
        </form>

        {error && (
          <p className='mt-4 text-sm font-bold text-red-700 text-center'>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
