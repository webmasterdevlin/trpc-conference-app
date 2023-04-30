import { DefaultLayout } from '@/components/DefaultLayout';
import '@/styles/globals.css';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import type { AppProps, AppType } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(<Component {...pageProps} />);
}) as AppType;

export default trpc.withTRPC(App);
