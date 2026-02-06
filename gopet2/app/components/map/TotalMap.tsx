"use client";
import Script from "next/script";
import { useNaverMaps } from "../../hooks/useNaverMaps";
import { useEffect, useRef, useState } from "react";
import { CafeData, FoodData, HospitalData, ParkData, useModalStore } from "../../hooks/useModalStore";


type PlaceType = "hospital" | "park" | "cafe" | "food";

const markerIcons: Record<PlaceType, string> = {
  hospital: "/picture_images/map/animalhospital_marker.png",
  park: "/picture_images/map/park_marker.png",
  cafe: "/picture_images/map/cafe_marker.png",
  food: "/picture_images/map/food_marker.png",
};

export default function TotalMap({ mapId = "map", hospital, park, cafe, food }: {
  mapId?: string;
  hospital: HospitalData[];
  park: ParkData[];
  cafe: CafeData[];
  food: FoodData[];
}) {
  const { initMap, mapRef, infoRaf } = useNaverMaps();

  useEffect(() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // 모달
  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  // 마커
  const [hospitalMarkers, setHospitalMarkers] = useState<naver.maps.Marker[]>([]);
  const [parkMarkers, setParkMarkers] = useState<naver.maps.Marker[]>([]);
  const [cafeMarkers, setCafeMarkers] = useState<naver.maps.Marker[]>([]);
  const [foodMarkers, setFoodMarkers] = useState<naver.maps.Marker[]>([]);

  // 현재 위치
  const [currentLocation, setCurrentLocation] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    const mapHospital: HospitalData[] = hospital.map((data: any) => ({
      type: "hospital",
      title: data.title,
      address: data.address,
      tel: data.tel,
      url: data.url,
      lat: Number(data.lat),
      lng: Number(data.lng),
      description: data.description || "",
      charge: data.charge || "",
    }));
    const mapPark: ParkData[] = park.map((data: any) => ({
      type: "park",
      title: data.title,
      address: data.address,
      tel: data.tel,
      url: data.url,
      lat: Number(data.lat),
      lng: Number(data.lng),
      description: data.description || "",
      charge: data.charge || "",
    }));
    const mapCafe: CafeData[] = cafe.map((data: any) => ({
      type: "cafe",
      title: data.title,
      address: data.address,
      tel: data.tel,
      url: data.url,
      lat: Number(data.lat),
      lng: Number(data.lng),
      description: data.description || "",
      charge: data.charge || "",
    }));
    const mapFood: FoodData[] = food.map((data: any) => ({
      type: "food",
      title: data.title,
      address: data.address,
      tel: data.tel,
      url: data.url,
      lat: Number(data.lat),
      lng: Number(data.lng),
      description: data.description || "",
      charge: data.charge || "",
    }));
    mapHospital;
    mapPark;
    mapCafe;
    mapFood;
  }, [hospital, park, cafe, food]);

  // 현재 위치 표시 토글
  const handleCurrentLocation = () => {
    if (!currentOpen) {
      if (!mapRef.current) return;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLatLng = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          const marker = new naver.maps.Marker({
            position: currentLatLng,
            map: mapRef.current!,
            title: "현재 위치",
          });

          mapRef.current!.setCenter(currentLatLng);

          setCurrentLocation(marker);
          setCurrentOpen(true);
        });
      }
    } else {
      if (currentLocation) {
        currentLocation.setMap(null);
        setCurrentLocation(null);
      }
      setCurrentOpen(false);
    }
  };
  //마커 표시
  const renderCafeMarkers = () => {
    const map = mapRef.current;
    if (!map || cafe.length === 0) return;

    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    if (!bounds) return;

    const sw = bounds.getSW();
    const ne = bounds.getNE();

    // 기존 마커 제거
    cafeMarkers.forEach((marker) => marker.setMap(null));

    // bounds 안에 있는 호텔만 필터
    const filteredCafe = cafe.filter(
      (cafe) =>
        cafe.lat >= sw.lat() &&
        cafe.lat <= ne.lat() &&
        cafe.lng >= sw.lng() &&
        cafe.lng <= ne.lng(),
    );

    // 새 마커 생성
    const newMarkers = filteredCafe.map((cafe) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(cafe.lat, cafe.lng),
        map,
        title: cafe.title,
        icon: {
          url: "/images/map/cafe_marker.png",
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 25),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        setModalData(cafe); // Zustand로 모달 데이터 설정
      });

      return marker;
    });

    setCafeMarkers(newMarkers);
  };
  const handleCafeLocation = () => {
    if (!mapRef.current) return;
    if (!isOpen) {
      renderCafeMarkers();
      setIsOpen(true);
    } else {
      cafeMarkers.forEach((marker) => marker.setMap(null));
      setCafeMarkers([]);
      setIsOpen(false);
    }
  }

  return (
    <>
      <div id={mapId} className="w-full h-[1000px]">
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
          strategy="afterInteractive"
          onLoad={() => initMap(mapId)}
        />

        {modalData && <div className="modal">{modalData.title}</div>}

        {/* 버튼 */}
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          onClick={handleCafeLocation}
          style={{ position: "absolute", top: 10, left: "40%", zIndex: 999 }}
        >
          카페
        </button>
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          // onClick={handleFoodLocation}
          style={{ position: "absolute", top: 10, left: "45%", zIndex: 999 }}
        >
          음식점
        </button>
        <button
          className={`flex justify-center items-center px-4 py-2 rounded-2xl transition ${
            currentOpen ? "bg-blue-800 text-white" : "bg-white/60 text-black"
          }`}
          onClick={handleCurrentLocation}
          style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
        >
          현재위치
        </button>
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          // onClick={handleHospitalLocation}
          style={{ position: "absolute", top: 10, left: "56%", zIndex: 999 }}
        >
          동물병원
        </button>
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          // onClick={handleParkLocation}
          style={{ position: "absolute", top: 10, left: "62%", zIndex: 999 }}
        >
          공원
        </button>
      </div>
    </>
  );
}
