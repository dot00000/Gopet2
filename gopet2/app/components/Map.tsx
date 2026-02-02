"use client";
import Script from "next/script";
import { useNaverMaps } from "../hooks/useNaverMaps";
import { useEffect, useState } from "react";
import shelter from "../assets/json/shelter.json";
import React from "react";
import { useModalStore } from "../hooks/useModalStore";

interface ShelterData {
  name: string;
  address: string;
  phone: string;
}

export default function Map({ mapId = "map"}) {
  const { initMap, mapRef, infoRaf } = useNaverMaps();

  useEffect (() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shelterMarkers, setShelterMarkers] = useState<naver.maps.Marker[]>([]);

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

  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  async function searchCoordinateToAddress(
    latlng: naver.maps.LatLng,
    title?: string
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
          infoRaf.current?.setContent(contentHtml);
          infoRaf.current?.open(mapRef.current!, latlng);

          resolve({ address, cityName });
        }
      );
    });
  }
  
  // 보호소 마커 
   const handleShelterLocation = () => {
    if (!isOpen) {
      const newMarkers = shelter.map((data) => {
        const marker = new window.naver.maps.Marker({
          position: new naver.maps.LatLng(Number(data.lat), Number(data.lng)),
          map: mapRef.current!,
          title: data.name,
          icon: {
            url: "/images/map/shelter_marker.png",
            scaledSize: new naver.maps.Size(50, 50),
            anchor: new naver.maps.Point(25, 25),
          },
        });

        naver.maps.Event.addListener(marker, "click", () => {
          const latlng = new naver.maps.LatLng(
            Number(data.lat),
            Number(data.lng)
          );
          searchCoordinateToAddress(latlng, data.name);
          setModalData({
            type: "shelter",
            title: data.name,
            region: data.region,
            address: data.address,
            phone: data.phone,
          });
        });

        return marker;
      });

      setShelterMarkers(newMarkers);
      setIsOpen(true);
    } else {
      shelterMarkers.forEach((marker) => marker.setMap(null));
      setShelterMarkers([]);
      setIsOpen(false);
    }
  };


  // 현재 위치 마커
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

        {modalData && <div className="modal">{modalData.title}</div>}


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
          onClick={handleShelterLocation}
          style={{ position: "absolute", top: 10, left: "60%", zIndex: 999 }}
        >
          {isOpen ? "보호소" : "보호소"}
        </button>
      </div>
    </>
  );
}
