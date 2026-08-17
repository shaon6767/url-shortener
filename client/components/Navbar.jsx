"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <Link href="/" className="text-lg font-semibold text-gray-900">
        URL Shortener
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-700 hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-600">{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:underline">
              Log in
            </Link>
            <Link href="/register" className="text-gray-700 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
