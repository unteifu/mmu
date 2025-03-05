import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import ActionBar from "./_components/ActionBar";
import NiceModalProvider from "~/providers/NiceModalProvider";

export const metadata: Metadata = {
  title: "Money Tracker",
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💰</text></svg>",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "discord",
      },
    });

    if (!url) {
      throw new Error("No URL returned from signInSocial");
    }

    redirect(url);
  }
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} h-screen w-full bg-neutral-100 text-neutral-700`}
    >
      <body>
        <TRPCReactProvider>
          <NiceModalProvider>
            <Navbar />
            <main className="mt-10 flex w-full justify-center">
              <div className="mx-4 w-full max-w-7xl">{children}</div>
            </main>
            <ActionBar />
            <Toaster />
          </NiceModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
