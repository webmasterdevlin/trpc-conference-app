import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
// This is backend code
export const commentRouter = router({
  all: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async () => {
      return [
        { id: '1', title: 'title1' },
        { id: '2', title: 'title2' },
      ];
    }),
});
