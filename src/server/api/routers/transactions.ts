import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { expenses, incomes, users } from "~/server/db/schema";

export const transactionsRouter = createTRPCRouter({
  getTransactions: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          amount: z.number(),
          currency: z.string(),
          category: z.string(),
          createdAt: z.date(),
          type: z.enum(["expense", "income"]),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const expenseCollection = await ctx.db.query.expenses.findMany({
        where: eq(expenses.userId, ctx.user.id),
        orderBy: [desc(expenses.createdAt)],
        columns: {
          id: true,
          amount: true,
          currency: true,
          category: true,
          createdAt: true,
        },
      });

      const incomeCollection = await ctx.db.query.incomes.findMany({
        where: eq(incomes.userId, ctx.user.id),
        orderBy: [desc(incomes.createdAt)],
        columns: {
          id: true,
          amount: true,
          currency: true,
          category: true,
          createdAt: true,
        },
      });

      const transactions = [
        ...expenseCollection.map((tx) => ({ ...tx, type: "expense" as const })),
        ...incomeCollection.map((tx) => ({ ...tx, type: "income" as const })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return transactions;
    }),
});
