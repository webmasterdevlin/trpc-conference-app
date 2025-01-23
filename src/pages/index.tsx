import { trpc } from '@/utils/trpc';
import { Fragment } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputBox from '@/components/InputBox';
import { PostFormSchema, PostFormSchemaType } from '@/utils/validators';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Item from '@/components/Item';
import TextAreaBox from '@/components/TextAreaBox';
// This is frontend code
export default function HomePage() {
  const utils = trpc.useUtils();

  /*
   * useQuery and useMutation are like stubs to call the server-side procedures
   */
  const commentQuery = trpc.comment.all.useQuery({ postId: '1' });
  const serverHealth = trpc.healthcheck.useQuery();
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

  /*
   * NO NEED FOR AXIOS OR FETCH because trpc handles all means of calling server-side procedures
   */
  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<PostFormSchemaType>({
    resolver: zodResolver(PostFormSchema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: PostFormSchemaType) => {
    try {
      await addPost.mutateAsync(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>tRPC demo</h1>
      <pre>this comment: {commentQuery.data?.at(0)?.title}</pre>
      <h3>{serverHealth.data}</h3>
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
            <Item item={item} key={item.id} />
          ))}
        </Fragment>
      ))}

      <hr />

      <h3>Add a Post</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <InputBox
            label="title"
            errors={errors}
            name="title"
            register={register}
          />
          <TextAreaBox
            label="body"
            errors={errors}
            name="body"
            register={register}
          />
          <Button
            disabled={!isValid || addPost.isLoading}
            type="submit"
            color="primary"
          >
            {isSubmitting ? 'submitting..' : 'Save Post'}
          </Button>

          {addPost.error && (
            <p style={{ color: 'red' }}>{addPost.error.message}</p>
          )}
        </Card>
      </form>
    </>
  );
}
