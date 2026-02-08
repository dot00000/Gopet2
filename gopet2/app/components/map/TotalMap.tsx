"use client";
import Script from "next/script";
import { useNaverMaps } from "../../hooks/useNaverMaps";
import { useEffect, useState } from "react";
import {
  CafeData,
  FoodData,
  HospitalData,
  ParkData,
  useModalStore,
} from "../../hooks/useModalStore";
import { IoRefresh } from "react-icons/io5";

export default function TotalMap({
  mapId = "map",
  hospital,
  park,
  cafe,
  food,
}: {
  mapId?: string;
  hospital: HospitalData[];
  park: ParkData[];
  cafe: CafeData[];
  food: FoodData[];
}) {
  const { initMap, mapRef } = useNaverMaps();

  useEffect(() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // 모달
  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  // 마커
  const [hospitalMarkers, setHospitalMarkers] = useState<naver.maps.Marker[]>([],);
  const [foodMarkers, setFoodMarkers] = useState<naver.maps.Marker[]>([]);
  const [parkMarkers, setParkMarkers] = useState<naver.maps.Marker[]>([]);
  const [cafeMarkers, setCafeMarkers] = useState<naver.maps.Marker[]>([]);
  
  // 마커 확인
  const [activeType, setActiveType] = useState<'food' | 'cafe' | 'hospital' | 'park' | null>(null);
  // 현재 위치
  const [currentLocation, setCurrentLocation] = useState<naver.maps.Marker | null>(null);

  // 현재 위치 표시 토글
  const handleCurrentLocation = () => {
    if (!currentOpen) {
      if (!mapRef.current) return;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLatLng = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
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
  const renderMarkers = (
    data: any[],
    markers: any[],
    setMarkers: React.Dispatch<React.SetStateAction<any[]>>,
    iconUrl: string,
  ) => {
    const map = mapRef.current;
    if (!map || data.length === 0) return;

    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    if (!bounds) return;

    const sw = bounds.getSW();
    const ne = bounds.getNE();

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    // bounds 안에 있는 데이터만 필터
    const filteredData = data.filter(
      (item) =>
        item.lat >= sw.lat() &&
        item.lat <= ne.lat() &&
        item.lng >= sw.lng() &&
        item.lng <= ne.lng(),
    );

    // 새 마커 생성
    const newMarkers = filteredData.map((item) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(item.lat, item.lng),
        map,
        title: item.title,
        icon: {
          url: iconUrl,
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 25),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        setModalData(item);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  // 마커 생성
  const renderCafeMarkers = () =>
    renderMarkers(
      cafe,
      cafeMarkers,
      setCafeMarkers,
      "/images/map/cafe_marker.png",
    );

  const renderHospitalMarkers = () =>
    renderMarkers(
      hospital,
      hospitalMarkers,
      setHospitalMarkers,
      "/images/map/animalhospital_marker.png",
    );

  const renderParkMarkers = () =>
    renderMarkers(
      park,
      parkMarkers,
      setParkMarkers,
      "/images/map/park_marker.png",
    );
  const renderFoodMarkers = () =>
    renderMarkers(
      food,
      foodMarkers,
      setFoodMarkers,
      "/images/map/food_marker.png"
    )

  const handleLocationToggle = (
    type: 'food' | 'cafe' | 'hospital' | 'park',
    markers: naver.maps.Marker[],
    setMarkers: React.Dispatch<React.SetStateAction<naver.maps.Marker[]>>,
    renderMarkers: () => void,
  ) => {
    if (!mapRef.current) return;
    if (!isOpen) {
      renderMarkers();
      setActiveType(type);
      setIsOpen(true);
    } else {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
      setActiveType(null);
      setIsOpen(false);
    }
  };
  
    const handleRefreshLocation = () => {
      console.log('activeType: ', activeType);
      
      if (!activeType) return;
      setRefresh(true);
      
      switch(activeType) {
        case 'food':
          handleRefreshType(foodMarkers, setFoodMarkers, renderFoodMarkers);
          break;
        case 'cafe':
          handleRefreshType(cafeMarkers, setCafeMarkers, renderCafeMarkers);
          break;
        case 'hospital':
          handleRefreshType(hospitalMarkers, setHospitalMarkers, renderHospitalMarkers);
          break;
        case 'park':
          handleRefreshType(parkMarkers, setParkMarkers, renderParkMarkers);
          break;
      }
      setTimeout(() => setRefresh(false), 200);
    };

    const handleRefreshType = (
      markers: naver.maps.Marker[],
      setMarkers: React.Dispatch<React.SetStateAction<naver.maps.Marker[]>>,
      renderMarkers: () => void
    ) => {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
      renderMarkers();
    };

    // 마커 버튼 
    const handleFoodLocation = () => 
      handleLocationToggle('food', foodMarkers, setFoodMarkers, renderFoodMarkers);
    const handleCafeLocation = () =>
      handleLocationToggle('cafe', cafeMarkers, setCafeMarkers, renderCafeMarkers);
    const handleHospitalLocation = () =>
      handleLocationToggle('hospital', hospitalMarkers, setHospitalMarkers, renderHospitalMarkers);
    const handleParkLocation = () =>
      handleLocationToggle('park', parkMarkers, setParkMarkers, renderParkMarkers);

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
          onClick={handleFoodLocation}
          style={{ position: "absolute", top: 10, left: "45%", zIndex: 999 }}
        >
          음식점
        </button>
        <button
          className={`flex justify-center items-center px-4 py-2 rounded-2xl transition ${
            refresh ? "bg-blue-800 text-white" : "bg-white/60 text-black"
          }`}
          onClick={handleRefreshLocation}
          style={{ position: "absolute", top: 100, left: "49%", zIndex: 999 }}
        >
          <span className="text-xl mr-2">
            <IoRefresh />
          </span>
          새로고침
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
          onClick={handleHospitalLocation}
          style={{ position: "absolute", top: 10, left: "56%", zIndex: 999 }}
        >
          동물병원
        </button>
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          onClick={handleParkLocation}
          style={{ position: "absolute", top: 10, left: "62%", zIndex: 999 }}
        >
          공원
        </button>
      </div>
    </>
  );
}
