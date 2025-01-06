import Cloud1 from '@/assets/images/cloud1.png';
import Cloud2 from '@/assets/images/cloud2.png';
import Cloud3 from '@/assets/images/cloud3.png';
import Cloud4 from '@/assets/images/cloud4.png';
import Cloud5 from '@/assets/images/cloud5.png';
import Image, { StaticImageData } from 'next/image';

const cloudImages: StaticImageData[] = [Cloud1, Cloud2, Cloud3, Cloud4, Cloud5];
const cloudInitialXPositions = ['0', '50vw', '25vw', '90vw', '50vw'];

const CloudAnimation: React.FC = () => {
  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {cloudImages.map((CloudImage, idx) => (
        <div
          key={idx}
          className={`absolute cloud-${idx + 1}`}
          style={
            {
              '--start-x': cloudInitialXPositions[idx],
              '--start-y': `${idx * 20}%`,
              '--width': `${CloudImage.width}px`,
            } as React.CSSProperties
          }
        >
          <Image
            src={CloudImage}
            alt={`Cloud ${idx + 1}`}
            className={`${idx < 3 ? 'opacity-90' : ''}`}
          />
        </div>
      ))}
    </div>
  );
};

export default CloudAnimation;
