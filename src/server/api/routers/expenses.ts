import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { expenses, users } from "~/server/db/schema";

export const expensesRouter = createTRPCRouter({
  addExpense: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive().int(),
        category: z.enum([
          "FOOD",
          "TRANSPORT",
          "SHOPPING",
          "BILLS",
          "ENTERTAINMENT",
          "HEALTH",
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

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            portfolioValue: user.portfolioValue - amount,
          })
          .where(eq(users.id, ctx.user.id));

        await tx.insert(expenses).values({
          userId: user.id,
          amount,
          currency: user.defaultCurrency,
          category: input.category,
        });
      });

      return { success: true, newBalance: user.portfolioValue - amount };
    }),
});
