"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  return redirect("/");
}
