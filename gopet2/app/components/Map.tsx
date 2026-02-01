"use client";
import Script from "next/script";
import { useNaverMaps } from "../hooks/useNaverMaps";

export default function Map({ mapId = "map" }) {
  const { initMap } = useNaverMaps();

  return (
    <>
      <div id={mapId} className="w-full h-screen" />

      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={() => initMap(mapId)}
      />
    </>
  );
}
