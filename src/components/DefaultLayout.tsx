import Head from 'next/head';
import { ReactNode } from 'react';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>TRPC DEMO</title>
      </Head>
      <main className="container prose mx-auto">{children}</main>
    </>
  );
};
