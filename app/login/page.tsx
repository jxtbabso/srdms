"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not found");
      setLoading(false);
      return;
    }

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (memberError || !member) {
      alert("No member record linked to this account.");
      setLoading(false);
      return;
    }

    if (
      member.role === "admin" ||
      member.role === "sigma_chief" ||
      member.role === "deputy_chief" ||
      member.role === "committee_chairman"
    ) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/portal";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form
        onSubmit={signIn}
        className="border rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-2">
          SRDMS Login
        </h1>

        <p className="text-gray-400 mb-8">
          Sigma Records & Discipline Management System
        </p>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 bg-black border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-black border rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full border rounded p-3 hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}