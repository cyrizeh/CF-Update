import classNames from 'classnames';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import Main from '../Main/Main';
import OnboardingHeader from '../OnboardingHeader/OnboardingHeader';

interface OnboardingLayoutProps extends PropsWithChildren {
  className?: string;
}

const OnboardingLayout = ({ children, className }: OnboardingLayoutProps) => {
  return (
    <>
      <Head>
        <title>CryoFuture</title>
      </Head>
      <OnboardingHeader />
      <div className="top-0 z-20 flex h-[calc(100vh_-_64px)] items-start">
        <Main>
          <div
            className={classNames(
              'relative mx-auto h-full max-w-[1280px] self-center pt-7 text-2xl font-semibold md:pt-[100px]',
              className
            )}>
            {children}
          </div>
        </Main>
      </div>
    </>
  );
};

export default OnboardingLayout;
