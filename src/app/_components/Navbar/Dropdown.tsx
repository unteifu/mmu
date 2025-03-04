import { headers } from "next/headers";
import Image from "next/image";
import { DropdownMenu } from "radix-ui";
import React from "react";
import { auth } from "~/server/auth";
import SignOut from "./SignOut";

export default async function Dropdown() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="outline-none">
          {session?.user.image ? (
            <Image
              src={session?.user?.image}
              alt="User avatar"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
          ) : (
            <Image
              src={`https://api.dicebear.com/9.x/initials/webp?seed=${session?.user?.name}`}
              alt="User avatar"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="rounded-lg bg-white shadow-lg"
        sideOffset={18}
        align="end"
      >
        <SignOut />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
