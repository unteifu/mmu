import * as React from "react";
import Dropdown from "./Dropdown";

export default async function Navbar() {
  return (
    <nav className="flex w-full justify-center">
      <div className="mx-4 mt-4 flex w-full max-w-7xl justify-end rounded-lg bg-white p-3">
        <Dropdown />
      </div>
    </nav>
  );
}
