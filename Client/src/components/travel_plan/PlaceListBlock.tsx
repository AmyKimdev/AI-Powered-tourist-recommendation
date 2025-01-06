import ImageIcon from '@/assets/images/image_icon.png';
import Image from 'next/image';
const PlaceListBlock = ({ children }: any) => {
  return (
    <div className='list_component flex items-center border-solid border-2 w-full min-h-[100px] w-[300px]'>
      <div className='image_component border-solid border-2 rounded-md w-[64px] h-[64px] mx-[15px]'>
        <Image
          src={ImageIcon}
          alt='recommended_place'
          className='object-scale-down w-[64px] h-[64px]'
        ></Image>
      </div>
      {children}
    </div>
  );
};

export default PlaceListBlock;
