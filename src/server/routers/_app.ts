/**
 * This file contains the root router of your tRPC-backend
 */
import { adminProcedure, publicProcedure, router } from '../trpc';
import { commentRouter } from './comment';
import { postRouter } from './post';

const adminRouter = router({
  secretPlace: adminProcedure.query(() => 'a key'),
});

export const appRouter = router({
  // api/trpc/healthcheck
  healthcheck: publicProcedure.query(() => 'server is running'),
  // api/trpc/post.*
  post: postRouter,
  admin: adminRouter,
  test: publicProcedure.query(() => 'test'),
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
