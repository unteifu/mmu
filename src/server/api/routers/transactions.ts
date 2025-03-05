import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { transactions, users } from "~/server/db/schema";

export const transactionsRouter = createTRPCRouter({
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const transactionCollection = await ctx.db.query.transactions.findMany({
      where: eq(transactions.userId, ctx.user.id),
      orderBy: [desc(transactions.createdAt)],
      columns: {
        id: true,
        amount: true,
        currency: true,
        type: true,
        createdAt: true,
      },
    });

    return transactionCollection;
  }),
});
