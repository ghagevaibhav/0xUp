"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Appbar() {
  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-semibold">0xUp</h1>
      <div className="flex items-center space-x-4">
        <SignedIn>
            <UserButton />
        </SignedIn>
        <SignedOut>
            <SignInButton />
            <SignUpButton />
        </SignedOut>
      </div>
    </div>
  );
}
