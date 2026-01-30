"use client";
import { useRef, useState } from "react";
import { NaverMap } from "./types/map";
import { Coordinates } from "./types/store";
import Script from "next/script";

type Props = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
  searchQuery?: string;
  address?: string;
  orders?: string;
};

export const INITIAL_CENTER: Coordinates = [37.5262411, 126.99289439];
export const INITIAL_ZOOM = 10;

export default function Map({
  mapId = "map",
  initialCenter = { ...INITIAL_CENTER },
  initialZoom = 10,
}: Props) {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const infoRef = useRef<naver.maps.InfoWindow | null>(null);
  //   const markerRef = useRef<naver.maps.Marker[]>([]);

  // 선택된 위치 저장
  const [selectedLocation, setSelectedLocation] = useState<{
    sido: string;
    gungu: string;
  }>({ sido: "", gungu: "" });

  // 지도 로딩 후 실행
  const initializeMap = () => {
    const center = new window.naver.maps.LatLng(
      initialCenter[0],
      initialCenter[1],
    );
    const mapOptions = {
      center,
      zoom: initialZoom,
      scaleControl: false,
      logoControlOptions: {
        position: window.naver.maps.Position.RIGHT_TOP,
      },
      mapDataControl: false,
      zoomControl: false,
      mapTypeControl: false,
    };
    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;
  };

  // searchCoordinateToAddress
  async function searchCoordinateToAddress(
    latlng: naver.maps.LatLng,
    title?: string,
  ): Promise<{ address: string; cityName: string }> {
    return new Promise((resolve, reject) => {
      naver.maps.Service.reverseGeocode(
        {
          coords: latlng,
          orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR,
          ].join(","),
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            reject("주소 조회 실패");
            return;
          }
          const items = response?.v2?.results || [];
          if (items.length === 0) {
            resolve({ address: "주소 없음", cityName: "도시 정보 없음" });
            return;
          }
          const item = items[0];
          const cityName = item.region.area1.name;
          const address =
            item.region.area1.name +
            " " +
            item.region.area2.name +
            " " +
            item.region.area3.name +
            " " +
            item.region.area4.name +
            (item.land.number1 ? " " + item.land.number1 : "") +
            (item.land.number2 ? "-" + item.land.number2 : "") +
            (item.land.addition0?.value ? " " + item.land.addition0.value : "");
          const contentHtml = `
            <div style="position:relative;padding:10px;min-width:150px;min-height:80px;line-height:140%;font-size:12px;">
              <h1>${title || "정보없음"}</h1>
              <p>주소 : ${address}</p>
            </div>
          `;
          infoRef.current?.setContent(contentHtml);
          infoRef.current?.open(mapRef.current!, latlng);

          resolve({ address, cityName });
        },
      );
    });
  }

  const handleScriptLoad = () => {
    initializeMap();
  };

  return (
    <>
      <div
        className="flex"
        id={mapId}
        style={{ width: "100%", height: "800px", position: "relative" }}
      />

      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </>
  );
}
