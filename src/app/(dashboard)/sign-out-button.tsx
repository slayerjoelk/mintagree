"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-slate-500 hover:text-slate-700 text-sm"
    >
      Sign out
    </button>
  );
}
