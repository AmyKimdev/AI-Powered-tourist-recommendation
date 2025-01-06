import Image from 'next/image';
import Airplane from '@/assets/images/airplane.png';

const AirplaneAnimation: React.FC = () => {
  return (
    <div
      className='relative overflow-hidden airplane'
      style={
        {
          '--airplane-start-x': '0px',
          '--airplane-start-y': '100px',
          '--airplane-width': `${Airplane.width}px`,
          //   '--airplane-height': `${Airplane.height}px`,
        } as React.CSSProperties
      }
    >
      <Image src={Airplane} alt='airplane.png' className='rotate-12' />
    </div>
  );
};
export default AirplaneAnimation;
