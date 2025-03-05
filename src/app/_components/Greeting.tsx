import { headers } from "next/headers";
import React from "react";
import { auth } from "~/server/auth";

export default async function Greeting() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    }
    if (hours < 18) {
      return "Good Afternoon";
    }
    return "Good Evening";
  };

  return (
    <h1 className="text-3xl font-semibold">
      {`${getGreeting()} ${session ? session.user.name : "Guest"} 👋`}
    </h1>
  );
}
