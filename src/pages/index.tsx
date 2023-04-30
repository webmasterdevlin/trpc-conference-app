import { AppRouter } from '@/server/routers/_app';
import { trpc } from '@/utils/trpc';
import { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { Fragment } from 'react';

export default function HomePage() {
  const utils = trpc.useContext();
  const postQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });

  return (
    <>
      <h1>tRPC demo</h1>
      <h2>
        Latest Posts {postQuery.status === 'loading' && '(please wait..)'}
      </h2>

      <button
        onClick={() => postQuery.fetchPreviousPage()}
        disabled={
          !postQuery.hasPreviousPage || postQuery.isFetchingPreviousPage
        }
      >
        {postQuery.isFetchingPreviousPage
          ? 'Loading more...'
          : postQuery.hasPreviousPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>

      {postQuery.data?.pages.map((page, index) => (
        <Fragment key={page.items[0]?.id || index}>
          {page.items.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <Link href={`/post/${item.id}`}>View more</Link>
            </article>
          ))}
        </Fragment>
      ))}

      <hr />

      <h3>Add a Post</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const $form = e.currentTarget;
          const values = Object.fromEntries(new FormData($form));
          type Input = inferProcedureInput<AppRouter['post']['add']>;
          const input: Input = {
            title: values.title as string,
            text: values.text as string,
          };
          try {
            await addPost.mutateAsync(input);

            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add post');
          }
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          disabled={addPost.isLoading}
        />
        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <textarea id="text" name="text" disabled={addPost.isLoading} />
        <br />
        <input type="submit" disabled={addPost.isLoading} />

        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  );
}
