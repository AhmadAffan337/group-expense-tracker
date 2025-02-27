"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ProfileContentProps {
  email: string;
}

export default function ProfileContent({ email }: ProfileContentProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Save the user email in local storage for global use
  useEffect(() => {
    localStorage.setItem("userEmail", email);
  }, [email]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Profile
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome, <span className="font-medium">{email}</span>!
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/manage-groups")}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded transition-colors"
          >
            Manage Groups
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
