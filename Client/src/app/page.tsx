'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import UploadFile from '@/api/SendingImage';
import fetchLocationInfo from '@/api/fetchLocationInfo';
import generateAndStoreImage from '@/api/generateAndStoreImage';
import imageIcon from '@/assets/images/image_icon.png';
import CloudAnimation from '@/components/main/Cloud';
import { DialogDemo } from '@/components/resultModal/ResultModal';
import { Dialog } from '@/components/ui/dialog';
import useWindowHeightSize from '@/hooks/useWindowHeightSize';

import AirplaneAnimation from '@/components/main/Airplane';
import Globe from '@/components/main/Globe';
function Main() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseImage, setResponseImage] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [similarity, setSimilarity] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadedImageVisible, setIsUploadedImageVisible] = useState(false);
  const [locationInfo, setLocationInfo] = useState('');

  useWindowHeightSize();
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    // 파일 형식 오류가 있는 경우
    if (fileRejections.length > 0) {
      setErrorMessage('이미지 형식이 아닙니다!');
      setImage(null);
      setFile(null);
      return;
    }

    // 여러 파일이 드롭된 경우
    if (acceptedFiles.length > 1) {
      setErrorMessage('하나의 이미지 파일만 업로드 해주세요!');
      setImage(null);
      setFile(null);
      return;
    }

    // 하나의 파일만 드롭된 경우
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setImage(objectUrl);
        setFile(file);
        setErrorMessage('');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false, // 여러 파일 선택 옵션
  });

  const handleButtonClick = async () => {
    if (!file) {
      console.error('No file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setDialogOpen(true);
    setLoading(true);

    try {
      const response = await UploadFile(formData);
      console.log('Server response:', response);

      const { image_url, location, similarity } = response;

      const roundedSimilarity = Math.round(similarity);

      setResponseImage(image_url);
      setLocation(location);
      setSimilarity(roundedSimilarity);

      console.log(`Fetching location info for: ${location}`);
      const fetchedLocationInfo = await fetchLocationInfo(location);
      console.log('Fetched location info:', fetchedLocationInfo);
      setLocationInfo(fetchedLocationInfo);

      console.log(`Generating and storing image for: ${image_url}, ${location}`);
      await generateAndStoreImage(image_url, location);
      console.log('Image generation and storage complete');

      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false); // 에러가 발생해도 로딩 상태 해제 추후 출력 페이지 작성
    }
  };
  if (typeof window !== 'undefined') {
    const windowHeight = window.innerHeight;
    return (
      <main className='flex min-h-screen items-center justify-between'>
        <div className='w-full h-screen'>
          <div className='mx-[200px] lg:mx-[250px] max-[1200px]:mt-[10%] min-[1500px]:-mb-[150px] flex flex-col justify-between min-w-[460px]'>
            <div
              className={`relative text-8xl min-[1200px]:text-[144px] min-[1500px]:text-[192px] font-['Cafe24Moyamoya-Face-v1.0'] -py-3`}
            >
              여기서
            </div>
            <div
              className={`self-end relative text-8xl min-[1200px]:text-[144px] min-[1500px]:text-[192px] font-['Cafe24Moyamoya-Face-v1.0'] -my-3`}
            >
              세계속으로
            </div>
          </div>

          <div className='relative z-1 ml-[50px]'>
            <Globe />
          </div>
          <div className='fixed z-2 -mt-[600px]'>
            <AirplaneAnimation />
          </div>
          <div className='relative z-3 -mt-[800px]'>
            <CloudAnimation />
          </div>
          <div
            className='relative z-4 -mt-[300px] mb-[150px] ml-[40%] flex flex-col w-[500px] h-[100px] big-screen-size small-screen-size'
            style={
              {
                '--inner-height': `${windowHeight}px`,
              } as React.CSSProperties
            }
          >
            <div className='flex'>
              <div className='text-lg'>해외 이미지를 넣으면&nbsp;</div>
              <b className='text-lg'>국내에서 가장 비슷한 곳</b>
              <div className='text-lg'>을 찾아드려요!</div>
            </div>
            <div
              {...getRootProps()}
              className={`flex items-center bg-gray-100 rounded-3xl shadow-md justify-center mt-[10px] ${
                isDragActive ? 'bg-gray-200' : 'bg-gray-100'
              }`}
            >
              <input
                {...getInputProps()}
                className='w-[300px] h-[100px] bg-transparent pl-[10px]'
              />
              {!image && <Image src={imageIcon} alt='UploadImageIcon.png' />}
              {image && (
                <img
                  src={image}
                  alt='Uploaded Preview'
                  className='w-[300px] h-[100px] object-cover'
                />
              )}
            </div>

            <div>
              <button
                onClick={handleButtonClick}
                disabled={!file}
                className={`w-[500px] h-[50px] rounded-3xl shadow-md mt-[10px] ${
                  file ? 'bg-cyan-300 active:bg-cyan-400' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {file ? '여기랑 비슷한 곳 찾아주세요!' : '이미지를 업로드 해주세요!'}
              </button>
              {errorMessage && <div className='text-red-500 mt-2'>{errorMessage}</div>}
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogDemo
                responseImage={responseImage}
                location={location}
                locationInfo={locationInfo}
                similarity={similarity}
                isUploadedImageVisible={isUploadedImageVisible}
                setIsUploadedImageVisible={setIsUploadedImageVisible}
                image={image}
                loading={loading}
              />
            </Dialog>
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
