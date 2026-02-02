"use client";
import Script from "next/script";
import { useNaverMaps } from "../hooks/useNaverMaps";
import { useEffect, useRef, useState } from "react";
import shelter from "../assets/json/shelter.json";

interface ShelterData {
  name: string;
  address: string;
  phone: string;
}

export default function Map({ mapId = "map" }) {
  const { initMap, mapRef } = useNaverMaps();
  const [currentOpen, setCurrentOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<null | {
    type: "shelter";
    title: string;
    address?: string;
    region?: string;
    phone: string;
  }>(null);
  

  // 현재 위치 on/off
  const [currentLocation, setCurrentLocation] = useState<naver.maps.Marker | null>(null);
  const [shelterData, setShelterData] = useState<ShelterData[]>([]);
  useEffect(() => {
    const shelterData = shelter.map((data: any) => ({
      name: data.name,
      address: data.address,
      phone: data.phone,
    }));
    setShelterData(shelterData);
  }, []);
  
  

  // 현재 위치 버튼
  const handleCurrentLocation = () => {
    if (!currentOpen) {
      if (!mapRef.current) return;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          const marker = new naver.maps.Marker({
            position: currentLocation,
            map: mapRef.current!,
            title: "현재 위치",
          });

          mapRef.current!.setCenter(currentLocation);

          setCurrentLocation(marker); // 마커 상태 저장
          setCurrentOpen(true); // 상태 ON
        });
      }
    } else {
      // 마커 제거
      if (currentLocation) {
        currentLocation.setMap(null);
        setCurrentLocation(null);
      }
      setCurrentOpen(false);
    }
  };
  return (
    <>
      <div id={mapId} className="w-full h-[1000px]">
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
          strategy="afterInteractive"
          onLoad={() => initMap(mapId)}
        />

        <button
          className={`flex justify-center items-center px-4 py-2 rounded-2xl transition ${
            currentOpen ? "bg-blue-500 text-white" : "bg-white/60 text-black"
          }`}
          onClick={handleCurrentLocation}
          style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
        >
          {currentOpen ? "현재위치" : "현재위치"}
        </button>

        <button
          className={`flex justify-center items-center px-4 py-2 rounded-2xl transition
            ${isOpen ? "bg-blue-500 text-white" : "bg-white/60 text-black"}`}
          // onClick={handleShelterLocation}
          style={{ position: "absolute", top: 10, left: "40%", zIndex: 999 }}
        >
          {isOpen ? "보호소" : "보호소"}
        </button>
      </div>
    </>
  );
}
