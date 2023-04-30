/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 */

import { initTRPC } from '@trpc/server';
import { transformer } from '@/utils/transformer';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 **/
export const publicProcedure = t.procedure;

export const middleware = t.middleware;

export const mergeRouters = t.mergeRouters;
