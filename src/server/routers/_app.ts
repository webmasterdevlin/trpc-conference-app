/**
 * This file contains the root router of your tRPC-backend
 */
import { adminProcedure, publicProcedure, router } from '../trpc';
import { postRouter } from './post';

const adminRouter = router({
  secretPlace: adminProcedure.query(() => 'a key'),
});

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'server is running'),
  post: postRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
