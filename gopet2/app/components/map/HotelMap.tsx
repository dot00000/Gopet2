"use client";
import Script from "next/script";
import { useNaverMaps } from "../../hooks/useNaverMaps";
import { useEffect, useState } from "react";
import { HotelData, useModalStore } from "../../hooks/useModalStore";
import { IoRefresh } from "react-icons/io5";

export default function HotelMap({
  mapId = "map",
  hotels,
}: {
  mapId?: string;
  hotels: HotelData[];
}) {
  const { initMap, mapRef } = useNaverMaps();

  useEffect(() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [hotelMarkers, setHotelMarkers] = useState<naver.maps.Marker[]>([]);
  // 현재 위치
  const [currentLocation, setCurrentLocation] =
    useState<naver.maps.Marker | null>(null);
  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  useEffect(() => {
    const mapHotels: HotelData[] = hotels.map((data: any) => ({
      type: "hotel",
      title: data.title,
      address: data.address,
      tel: data.tel,
      url: data.url,
      lat: Number(data.lat),
      lng: Number(data.lng),
      si: data.si,
      gungu: data.gungu,
      description: data.description || "",
      charge: data.charge || "",
    }));
    mapHotels;
  }, [hotels]);

  const renderHotelMarkers = () => {
    const map = mapRef.current;
    if (!map || hotels.length === 0) return;

    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    if (!bounds) return;

    const sw = bounds.getSW();
    const ne = bounds.getNE();

    // 기존 마커 제거
    hotelMarkers.forEach((marker) => marker.setMap(null));

    // bounds 안에 있는 호텔만 필터
    const filteredHotels = hotels.filter(
      (hotel) =>
        hotel.lat >= sw.lat() &&
        hotel.lat <= ne.lat() &&
        hotel.lng >= sw.lng() &&
        hotel.lng <= ne.lng(),
    );

    // 새 마커 생성
    const newMarkers = filteredHotels.map((hotel) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(hotel.lat, hotel.lng),
        map,
        title: hotel.title,
        icon: {
          url: "/images/map/hotel_marker.png",
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 25),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        setModalData(hotel); // Zustand로 모달 데이터 설정
      });

      return marker;
    });

    setHotelMarkers(newMarkers);
  };

  // 숙소 버튼
  const handleHotelLocation = () => {
    if (!mapRef.current) return;
    if (!isOpen) {
      renderHotelMarkers();
      setIsOpen(true);
    } else {
      hotelMarkers.forEach((marker) => marker.setMap(null));
      setHotelMarkers([]);
      setIsOpen(false);
    }
  };
  // 새로고침 버튼
  const handleRefreshLocation = () => {
    if (!isOpen) return;
    setRefresh(true);

    hotelMarkers.forEach((marker) => marker.setMap(null));
    setHotelMarkers([]);

    renderHotelMarkers();
    setTimeout(() => setRefresh(false), 200);
  };
  // 현재 위치 마커
  const handleCurrentLocation = () => {
    if (!currentOpen) {
      if (!mapRef.current) return;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
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
          className={`flex font-bold justify-center items-center px-4 py-2 rounded-4xl transition ${
            currentOpen ? "bg-blue-800 text-white" : "bg-white/60 text-black"
          }`}
          onClick={handleCurrentLocation}
          style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
        >
          {currentOpen ? "현재위치" : "현재위치"}
        </button>
        <button
          className={`flex font-bold justify-center items-center px-4 py-2 rounded-4xl transition ${
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
          className={`flex font-bold justify-center items-center px-4 py-2 rounded-4xl transition
            ${isOpen ? "bg-blue-800 text-white" : "bg-white/60 text-black"}`}
          onClick={handleHotelLocation}
          style={{ position: "absolute", top: 10, left: "60%", zIndex: 999 }}
        >
          {isOpen ? "숙소" : "숙소"}
        </button>
      </div>
    </>
  );
}
