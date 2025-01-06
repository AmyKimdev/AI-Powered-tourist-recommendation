import GlobeSvg from '@/assets/images/globe.svg';

function Globe() {
  if (process.browser) {
  }
  return (
    <div className='w-[300px] h-[300px] min-[1200px]:w-[400px] min-[1200px]:h-[400px] min-[1500px]:w-[500px] min-[1500px]:h-[500px]'>
      <GlobeSvg className='animate-spin-slow' />
    </div>
  );
}

export default Globe;
