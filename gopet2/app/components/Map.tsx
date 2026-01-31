"use client";
import { useState } from "react";
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
}: Props) {
  
  // 선택된 위치 저장
  const [selectedLocation, setSelectedLocation] = useState<{
    sido: string;
    gungu: string;
  }>({ sido: "", gungu: "" });

  
  const handleScriptLoad = () => {
    Map;
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
