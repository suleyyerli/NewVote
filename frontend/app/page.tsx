"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">Bienvenue sur NewVote</h1>
        <button
          onClick={() => router.push("/auth")}
          className="btn btn-primary btn-lg"
        >
          S&apos;authentifier
        </button>
      </div>
    </main>
  );
}
