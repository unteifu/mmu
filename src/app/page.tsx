import { api, HydrateClient } from "~/trpc/server";
import Greeting from "./_components/Greeting";
import PortfolioOverview from "./_components/PortfolioOverview";
import { auth } from "~/server/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    void api.portfolio.getPorfolio.prefetch();
  }

  return (
    <HydrateClient>
      <div className="w-full rounded-xl bg-white p-10">
        <Greeting />
        <PortfolioOverview />
      </div>
    </HydrateClient>
  );
}
