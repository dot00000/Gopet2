"use client";
import Script from "next/script";
import { useNaverMaps } from "../hooks/useNaverMaps";

type PlaceType = "hospital" | "park" | "cafe" | "food"

export default function Map({ mapId = "map" }) {
  const { initMap } = useNaverMaps();

  const markerIcons: Record<PlaceType, string> = {
        hospital: "/picture_images/map/animalhospital_marker.png",
        park: "/picture_images/map/park_marker.png",
        cafe: "/picture_images/map/cafe_marker.png",
        food: "/picture_images/map/food_marker.png",
  }

  async function showMarkers(type: PlaceType, keyword: string) {
    
  }
  return (
    <>
      <div id={mapId} className="w-full h-[1000px]" />
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy="afterInteractive"
        onLoad={() => initMap(mapId)}
      />
    </>
  );
}
