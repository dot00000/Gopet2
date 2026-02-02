import { useCallback, useRef, useState } from "react";
import { Coordinates } from "../components/types/store";

const naverMapsConfig = {
    naverMapId: process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
}
export const INITIAL_CENTER: Coordinates = [37.5262411, 126.99289439];
export const INITIAL_ZOOM = 10;

  
  export function useNaverMaps() {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const infoRaf = useRef<naver.maps.InfoWindow | null>(null);
  
  const initMap = useCallback((mapId: string) => {
    if (!window.naver || mapRef.current) return;
    
    const map = new window.naver.maps.Map(mapId, {
      center: new window.naver.maps.LatLng(
        INITIAL_CENTER[0],
        INITIAL_CENTER[1]
      ),
      zoom: INITIAL_ZOOM,
      zoomControl: false,
      mapTypeControl: false,
      mapDataControl: false,
      scaleControl: false,
      logoControlOptions: {
        position: window.naver.maps.Position.RIGHT_TOP,
      },
    });
    mapRef.current = map;

  }, []);

  return { initMap, mapRef, infoRaf };
}
