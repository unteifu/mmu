"use client";
import { DropdownMenu } from "radix-ui";
import React from "react";
import { signOut } from "~/actions/signOut";
import { IconDoorExit } from "@tabler/icons-react";

export default function SignOut() {
  return (
    <DropdownMenu.Item
      onClick={() => signOut()}
      className="group flex cursor-default items-center gap-2 px-5 py-2 pr-20 outline-none hover:cursor-pointer"
    >
      <IconDoorExit size={16} className="group-hover:text-red-500" />
      <span className="text-sm font-medium group-hover:text-red-500">
        Sign out
      </span>
    </DropdownMenu.Item>
  );
}
