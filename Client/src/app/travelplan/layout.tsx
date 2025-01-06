import TravelHeader from '@/components/shared/TravelHeader';
import { ReactNode } from 'react';
import '../globals.css';
export const metadata = {
  title: 'My App',
  description: 'This is my app',
};

export default function TravelPlanLayout({ children }: { children: ReactNode }) {
  return (
    <div className='bg-white'>
      <TravelHeader />
      <main className='ml-[85px] h-full '>{children}</main>
    </div>
  );
}
