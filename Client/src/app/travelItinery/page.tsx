//app/travelItinery/page.tsx
'use client';

import SplitPane from "react-split-pane-next";
import React, { useState, useEffect } from 'react';
import Map from '../../components/kakaoMap/kakaoMap';
import TravelHeader from '../../components/shared/TravelHeader';

const App: React.FC = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    // 현재 위치 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error('Error getting current position:', error);
        // 기본 위치 설정
        setLatitude(37.5665);
        setLongitude(126.9780);
      }
    );
  }, []);

  return (
    <div className="h-screen">
      <SplitPane split="vertical" minSize={50}>
        <div className="bg-white h-full flex flex-col">
          <div className="bg-gray-200 p-4">
            <TravelHeader />
          </div>
          <div className="bg-gray-100 p-4 flex-1">
            {/* 여기에 일정 목록 박스 내용을 추가하세요 */}
          </div>
        </div>
        
        <div className="bg-yellow-500 h-full">
          {latitude !== 0 && longitude !== 0 && (
            <Map latitude={latitude} longitude={longitude} />
          )}
        </div>
      </SplitPane>
    </div>
  );
}

export default App;



//app/travelItinery/page.tsx
// 'use client';

// import SplitPane from "react-split-pane-next";
// import React, { useState, useEffect } from 'react';
// import Map from '../../components/kakaoMap/kakaoMap';
// import TravelHeader from '../../components/shared/TravelHeader';

// const App: React.FC = () => {
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);

//   useEffect(() => {
//     // 현재 위치 가져오기
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//       },
//       (error) => {
//         console.error('Error getting current position:', error);
//         // 기본 위치 설정
//         setLatitude(37.5665);
//         setLongitude(126.9780);
//       }
//     );
//   }, []);

//   return (
//     <div className="h-screen flex">
//       <TravelHeader />
//       <div className="flex-1">
//         <SplitPane split="vertical" minSize={40}>
//           <div className="bg-white h-full"></div>
          
//           <div className="bg-white-500 h-full">
//             {latitude !== 0 && longitude !== 0 && (
//               <Map latitude={latitude} longitude={longitude} />
//             )}
//           </div>
//         </SplitPane>
//       </div>
//     </div>
//   );
// }

// export default App;





//app/travelItinery/page.tsx
// 'use client';

// import SplitPane from "react-split-pane-next";
// import React, { useState, useEffect } from 'react';
// import Map from '../../components/kakaoMap/kakaoMap';


// const App: React.FC = () => {
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);

//   useEffect(() => {
//     // 현재 위치 가져오기
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//       },
//       (error) => {
//         console.error('Error getting current position:', error);
//         // 기본 위치 설정
//         setLatitude(37.5665);
//         setLongitude(126.9780);
//       }
//     );
//   }, []);

//   return (
//     <div className="h-screen">
//       <SplitPane split="vertical" minSize={40}>
//         <div className="bg-red-500 h-full">This is a div</div>
        
//         <div className="bg-white-500 h-full">
//           {latitude !== 0 && longitude !== 0 && (
//             <Map latitude={latitude} longitude={longitude} />
//           )}
//         </div>
//       </SplitPane>
//     </div>
//   );
// }

// export default App;





// 디폴트2 + 구분자 20px
// 'use client';

// import SplitPane from "react-split-pane-next";
// import React from 'react';


// export default function App() {
//   return (
//     <div className="h-screen">
//       <SplitPane split="vertical" minSize={50} defaultSize="50%" resizerStyle={{ width: '20px', background: 'white', cursor: 'col-resize' }}>
//         <div className="bg-red-500 h-full">This is a div</div>
//         <div className="bg-yellow-500 h-full">This is a div</div>
//       </SplitPane>
//     </div>
//   );
// }







// 디폴트
// 'use client';

// import SplitPane from "react-split-pane-next";
// import React from 'react';

// const App: React.FC = () => {
//   return (
//     <div className="h-screen">
//       <SplitPane split="vertical" minSize={50}>
//         <div className="bg-red-500 h-full">This is a div</div>
//         <div className="bg-yellow-500 h-full">This is a div</div>
//       </SplitPane>
//     </div>
//   );
// }

// export default App;




// 'use client';

// import { useState, useEffect } from 'react';
// import Map from '../../components/kakaoMap/kakaoMap'; // kakaoMap.tsx 파일의 경로에 맞게 수정해주세요.

// export default function Home() {
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);

//   useEffect(() => {
//     // 현재 위치 가져오기
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//       },
//       (error) => {
//         console.error('Error getting current position:', error);
//         // 기본 위치 설정
//         setLatitude(37.5665);
//         setLongitude(126.9780);
//       }
//     );
//   }, []);

//   return (
//     <div>
//       {/* <h1>Welcome to My App</h1> */}
//       {latitude !== 0 && longitude !== 0 && (
//         <Map latitude={latitude} longitude={longitude} />
//       )}
//     </div>
//   );
// }





// 'use client';

// import { useState, useEffect } from 'react';
// import Map from '../../components/kakaoMap/kakaoMap'; // kakaoMap.tsx 파일의 경로에 맞게 수정해주세요.

// export default function Home() {
//   const [latitude, setLatitude] = useState(0);
//   const [longitude, setLongitude] = useState(0);

//   useEffect(() => {
//     // 현재 위치 가져오기
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLatitude(position.coords.latitude);
//         setLongitude(position.coords.longitude);
//       },
//       (error) => {
//         console.error('Error getting current position:', error);
//         // 기본 위치 설정
//         setLatitude(37.5665);
//         setLongitude(126.9780);
//       }
//     );
//   }, []);

//   return (
//     <div>
//       {/* <h1>Welcome to My App</h1> */}
//       {latitude !== 0 && longitude !== 0 && (
//         <Map latitude={latitude} longitude={longitude} />
//       )}
//     </div>
//   );
// }

