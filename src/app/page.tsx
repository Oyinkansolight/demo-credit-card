'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import CheckoutCard from '@/components/cards/CheckoutCard';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Demo Card Payment System</title>
      </Head>
      <section className='bg-gray-200'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <CheckoutCard />
        </div>
      </section>
    </main>
  );
}
