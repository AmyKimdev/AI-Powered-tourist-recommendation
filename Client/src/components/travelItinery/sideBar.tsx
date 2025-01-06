import React from 'react';
import SplitPane, { Pane } from 'react-split-pane-next';
import styled from '@emotion/styled';
import KakaoMap from '../kakaoMap/kakaoMap'; // 경로에 맞게 수정해주세요.

interface SlideBarProps {
  width: number;
  latitude: number;
  longitude: number;
}

const SlideBar: React.FC<SlideBarProps> = ({ width, latitude, longitude }) => {
  return (
    <SplitPane split="vertical" minSize={200} defaultSize={width}>
      <Pane initialSize="50%" minSize="200px">
        <SidebarContainer>
          <p>Sidebar content</p>
          <button id="add-content" className="bg-green-600 w-20 float-right">
            Add Content
          </button>
          <button id="remove-content" className="bg-salmon-500 w-20 float-right">
            Remove Content
          </button>
        </SidebarContainer>
      </Pane>
      <Pane initialSize="50%">
        <MapContainer>
          <KakaoMap latitude={latitude} longitude={longitude} />
        </MapContainer>
      </Pane>
    </SplitPane>
  );
};

const SidebarContainer = styled.div`
  background-color: lightgray;
  border: 2px solid darkgray;
  height: 100%;
`;

const MapContainer = styled.div`
  height: 100%;
`;

export default SlideBar;
