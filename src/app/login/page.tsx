"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  function handleLogin() {
    document.cookie = "token=mock.jwt.token; path=/";
    router.push("/dashboard");
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login</button>
    </main>
  );
}
