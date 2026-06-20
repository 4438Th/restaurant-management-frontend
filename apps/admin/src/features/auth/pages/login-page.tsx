"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Input } from "@repo/ui";

import { useLogin } from "../hooks/use-login";

export function LoginPage() {
  const router = useRouter();

  const login = useLogin();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login.mutateAsync({
        username,
        password,
      });

      router.push("/dashboard");
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  }
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded border p-6"
      >
        <h1 className="text-xl font-bold">Restaurant Admin</h1>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => handleUsernameChange(e)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
