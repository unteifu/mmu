"use client";
import { signIn } from "~/utils/authClient";

export default function SignIn() {
  return (
    <button onClick={() => signIn()}>
      <span>Log In</span>
    </button>
  );
}
