import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
export function DialogDemo({
  responseImage,
  location,
  locationInfo,
  isUploadedImageVisible,
  setIsUploadedImageVisible,
  image,
  loading,
  similarity,
}) {
  const handleToggleImage = () => {
    setIsUploadedImageVisible(!isUploadedImageVisible);
  };
  return (
    <DialogContent className='sm:max-w-[1200px] h-[800px]'>
      <DialogHeader>
        <DialogTitle>
          <Button variant='link' onClick={handleToggleImage} className='text-gray-500'>
            {isUploadedImageVisible ? '서버에서 받은 사진 보기' : '내가 넣은 사진 보기'}
          </Button>
        </DialogTitle>
      </DialogHeader>
      <div className='w-full h-[400px] bg-gray-200 flex items-center justify-center'>
        <div className='flex items-center justify-center w-full h-full'>
          {loading ? (
            <Skeleton className='w-full h-full' />
          ) : isUploadedImageVisible ? (
            <img
              src={image}
              alt='Uploaded image'
              className='max-w-full max-h-full object-contain'
            />
          ) : responseImage ? (
            <img
              src={responseImage}
              alt='Response image'
              className='max-w-full max-h-full object-contain'
            />
          ) : (
            <Skeleton className='w-full h-full' />
          )}
        </div>
      </div>

      <div className='grid gap-1 place-items-center py-4'>
        <div className='flex flex-col space-y-3 text-center'>
          <DialogDescription className='h-10 text-black inline-flex items-center justify-center'>
            비슷한 장소로 {loading ? <Skeleton className='h-4 w-[50px]' /> : <>{location}</>}{' '}
            어때요?
          </DialogDescription>
          <DialogDescription className='h-10 text-black inline-flex items-center justify-center'>
            유사도 {loading ? <Skeleton className='h-4 w-[25px]' /> : <>{similarity}</>} %
          </DialogDescription>
          <DialogDescription className='h-10 text-black inline-flex items-center justify-center'>
            {loading ? <Skeleton className='h-4 w-[450px]' /> : <>{locationInfo}</>}
          </DialogDescription>
        </div>
      </div>
      <DialogFooter>
        <Button variant='link'>더 많은 정보 보러 가기</Button>
      </DialogFooter>
    </DialogContent>
  );
}
