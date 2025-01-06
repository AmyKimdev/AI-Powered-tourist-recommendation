// components/kakaoMap/kakaoMap.tsx
import styled from "@emotion/styled";
import { useEffect } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
}

function Map({ latitude, longitude }: MapProps) {
  useEffect(() => {
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
        };
        const map = new window.kakao.maps.Map(container, options);

        // 지도 크기 조절
        const handleResize = () => {
          const mapWidth = document.documentElement.clientWidth - 430; // 슬라이드바의 최소 너비를 고려하여 계산
          const mapHeight = mapWidth * (220 / 320); // 가로 세로 비율 유지
          map.setSize(new window.kakao.maps.Size(mapWidth, mapHeight));
        };

        handleResize(); // 초기 크기 설정
        window.addEventListener("resize", handleResize); // 창 크기 변경 시 지도 크기 조절

        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  }, [latitude, longitude]);

  return (
    <MapContainer id="map" />
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default Map;