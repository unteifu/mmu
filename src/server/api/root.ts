import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { portfolioRouter } from "~/server/api/routers/portfolio";
import { expensesRouter } from "./routers/expenses";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  portfolio: portfolioRouter,
  expenses: expensesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
