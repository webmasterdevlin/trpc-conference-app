import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { NextPageContext } from 'next';

import type { AppRouter } from '@/server/routers/_app';
import { transformer } from './transformer';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
}

// Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
export interface SSRContext extends NextPageContext {
  status?: number;
}

// A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
// the AppRouter below links the backend to the frontend
export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    // If you want to use SSR, you need to use the server's full URL

    return {
      transformer,
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // Set custom request headers on every request from tRPC
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }
            // To use SSR properly, you need to forward the client's headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            const {
              // If you're using Node 18 before 18.15.0, omit the "connection" header
              connection: _connection,
              ...headers
            } = ctx.req.headers;

            return headers;
          },
        }),
      ],
    };
  },

  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;
    // If HTTP status set, propagate that
    if (ctx.status) {
      return {
        status: ctx.status,
      };
    }

    const error = opts.clientErrors[0];
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }

    // for app caching with SSR see https://trpc.io/docs/caching
    // cache request for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      headers: {
        'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    };
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
