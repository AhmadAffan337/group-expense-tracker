// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <h1 className="text-4xl font-extrabold text-gray-800">
        Welcome to Group Expense Tracker App
      </h1>
      <p className="text-lg text-gray-600">
        Please login or sign up to continue.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition-colors">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-2 font-semibold text-white bg-green-500 rounded-md shadow hover:bg-green-600 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
