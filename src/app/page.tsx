import { api, HydrateClient } from "~/trpc/server";
import Greeting from "./_components/Greeting";
import PortfolioOverview from "./_components/PortfolioOverview";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import TransactionHistory from "./_components/TransactionHistory";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    void api.portfolio.getPortfolio.prefetch();
    void api.transactions.getTransactions.prefetch();
  }

  return (
    <HydrateClient>
      <div className="flex flex-col gap-5">
        <div className="w-full rounded-xl bg-white p-10">
          <Greeting />
          <PortfolioOverview />
        </div>
        <div className="mb-20 w-full rounded-xl bg-white p-10">
          <TransactionHistory />
        </div>
      </div>
    </HydrateClient>
  );
}
