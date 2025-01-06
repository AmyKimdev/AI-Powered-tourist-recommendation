import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import Script from 'next/script';
import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'This is my app',
};

declare global {
  interface Window {
    kakao: any;
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
        <Script
          strategy='beforeInteractive'
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&autoload=false&libraries=services`}
        />
      </head>
      <body className='bg-gradient-to-b from-cyan-500 to-white-500 to-90% overflow-hidden h-full min-w-[720px]'>
        <Header />
        <main className='h-full'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
