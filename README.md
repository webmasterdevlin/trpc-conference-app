## Development

### Start project

```bash
pnpm create next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-starter trpc-prisma-starter
cd trpc-prisma-starter
pnpm
pnpm dx
```

### Commands

```bash
pnpm build      # runs `prisma generate` + `prisma migrate` + `next build`
pnpm db-reset   # resets local db
pnpm dev        # starts next.js
pnpm dx         # starts postgres db + runs migrations + seeds + starts next.js
pnpm test-dev   # runs e2e tests on dev
pnpm test-start # runs e2e tests on `next start` - build required before
pnpm test:unit  # runs normal Vitest unit tests
pnpm test:e2e   # runs e2e tests
```

### Steps to reproduce

- configure tsconfig.json with strictNullChecks and string enabled
- Do the src/server/env.js
- Do next.config.js
- Do src/utils/publicRuntimeConfig.ts
- Do src/utils/transformer.ts
- Do the src/server folder
  prisma.ts
  context.ts
  trpc.ts
- Do the src/server/routers folder
  post.ts
  \_app.ts
- Do src/utils/trpc.ts
- Do the src/pages/api/trpc folder
- Do the frontend using
  components/DefaultLayout.tsx
  pages/\_app.tsx
  pages/post/[id].tsx
  pages/index.tsx
  then add
  trpc.useContext
  trpc.post.list.useInfiniteQuery
  trpc.post.byId.useQuery
  trpc.post.add.useMutation
