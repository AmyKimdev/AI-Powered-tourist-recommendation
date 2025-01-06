function TravelHeader() {
  return (
    <header className='fixed left-0 w-[85px] z-1 overflow-hidden h-full justify-between'>
      <nav className='h-full text-lg font-medium flex flex-col items-center text-sm gap-20 mt-[20px]'>
        <div>PicT</div>
        <div className='text-center text-base text-cyan-500'>
          STEP 1 <br />
          장소 선택
        </div>
        <div className='text-center text-xs text-gray-500/50'>
          STEP 2 <br /> 일정 편집
        </div>
      </nav>
    </header>
  );
}

export default TravelHeader;
