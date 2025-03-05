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
});
