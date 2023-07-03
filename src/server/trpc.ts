/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '@/utils/transformer';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  /**
   * You are able to serialize the response data & input args using superjson.
   * The transformers need to be added both to the server and the client.
   */
  transformer,
  /**
   * The error formatting in your router will be inferred all the way to your client (& React components)
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a router
 * To begin building your tRPC-based API, you'll first need to define your router.
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * A procedure is a function which is exposed to the client, it can be query, mutation or subscription.
 **/
export const publicProcedure = t.procedure;

/**
A function that can run code before and after a procedure. 
Can modify context.
*/
export const middleware = t.middleware;

/* merge routers with other routers.*/
export const mergeRouters = t.mergeRouters;

const isAdmin = middleware(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user?.isAdmin) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const adminProcedure = publicProcedure.use(isAdmin);
