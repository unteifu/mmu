import { TRPCError } from "@trpc/server";
import { eq, and, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { incomes, expenses, users } from "~/server/db/schema";

export const portfolioRouter = createTRPCRouter({
  getPortfolio: protectedProcedure
    .output(
      z.object({
        currency: z.string(),
        totalValue: z.number(),
        percentageChange: z.number().nullable(),
      }),
    )
    .query(async ({ ctx }) => {
      const portfolio = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!portfolio) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Portfolio not found",
        });
      }

      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      const yesterdayEnd = new Date(todayStart);
      yesterdayEnd.setMilliseconds(yesterdayEnd.getMilliseconds() - 1);

      const yesterdayIncomes = await ctx.db.query.incomes.findMany({
        where: and(
          eq(incomes.userId, ctx.user.id),
          sql`${incomes.createdAt} <= ${yesterdayEnd.toISOString()}`,
        ),
        orderBy: [desc(incomes.createdAt)],
      });

      const yesterdayExpenses = await ctx.db.query.expenses.findMany({
        where: and(
          eq(expenses.userId, ctx.user.id),
          sql`${expenses.createdAt} <= ${yesterdayEnd.toISOString()}`,
        ),
        orderBy: [desc(expenses.createdAt)],
      });

      const yesterdayIncomeTotal = yesterdayIncomes.reduce(
        (sum, tx) => sum + tx.amount,
        0,
      );
      const yesterdayExpenseTotal = yesterdayExpenses.reduce(
        (sum, tx) => sum + tx.amount,
        0,
      );
      const yesterdayBalance = yesterdayIncomeTotal - yesterdayExpenseTotal;

      let percentageChange = null;
      if (yesterdayBalance !== 0) {
        percentageChange =
          ((portfolio.portfolioValue - yesterdayBalance) /
            Math.abs(yesterdayBalance)) *
          100;
      }

      return {
        currency: portfolio.defaultCurrency,
        totalValue: portfolio.portfolioValue,
        percentageChange: percentageChange
          ? Number(percentageChange.toFixed(2))
          : null,
      };
    }),
  addIncome: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive().int(),
        category: z.enum([
          "SALARY",
          "FREELANCE",
          "INVESTMENT",
          "GIFT",
          "OTHER",
        ]),
      }),
    )
    .output(z.object({ success: z.boolean(), newBalance: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const amount = input.amount * 100;
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const newBalance = user.portfolioValue + amount;

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            portfolioValue: newBalance,
          })
          .where(eq(users.id, ctx.user.id));

        await tx.insert(incomes).values({
          userId: user.id,
          amount,
          currency: user.defaultCurrency,
          category: input.category,
        });
      });

      return { success: true, newBalance };
    }),
});
