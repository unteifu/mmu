import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const portfolioRouter = createTRPCRouter({
  getPorfolio: protectedProcedure
    .output(
      z.object({
        currency: z.string(),
        totalValue: z.number(),
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

      return {
        currency: portfolio.defaultCurrency,
        totalValue: portfolio.portfolioValue,
      };
    }),
  addIncome: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive().int(),
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

      await ctx.db
        .update(users)
        .set({
          portfolioValue: user.portfolioValue + amount,
        })
        .where(eq(users.id, ctx.user.id));

      return { success: true, newBalance: user.portfolioValue + amount };
    }),
});
