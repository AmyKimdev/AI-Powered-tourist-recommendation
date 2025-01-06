import Link from 'next/link';

import Join from '@/components/login-join/Join';
import Login from '@/components/login-join/Login';

function Header() {
  return (
    <header className='z-10 sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6 flex justify-between'>
      <nav className='w-full h-16 flex-row gap-6 text-lg font-medium flex flex-row items-center gap-5 text-sm lg:gap-10'>
        <Link
          href={'/'}
          className='flex h-16 items-center gap-2 text-lg font-semibold md:text-base '
        >
          <div></div>
          <span className='sr-only'>PicT</span>
        </Link>

        <Link href={'/'} className='text-foreground transition-colors hover:text-muted'>
          메인1
        </Link>
        <Link href={'/travelplan'} className='text-foreground transition-colors hover:text-muted'>
          여행일지
        </Link>
        <Login />
        <Join />
      </nav>
    </header>
  );
}

export default Header;
