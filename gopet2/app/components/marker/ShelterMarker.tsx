"use client";
import Script from "next/script";
import { IoRefresh } from "react-icons/io5";
import { useNaverMaps } from "../../hooks/useNaverMaps";
import { useEffect, useState } from "react";
import { useModalStore } from "../../hooks/useModalStore";
import shelter from "../../assets/json/shelter.json";

export default function ShelterMarker({ mapId = "map" }) {
  const { initMap, mapRef } = useNaverMaps();

  useEffect(() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shelterMarkers, setShelterMarkers] = useState<naver.maps.Marker[]>([]);
  const [currentLocation, setCurrentLocation] =
    useState<naver.maps.Marker | null>(null);

  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  useEffect(() => {
    const shelterData = shelter.map((data: any) => ({
      name: data.name,
      address: data.address,
      phone: data.phone,
    }));
    shelterData;
  }, []);

  // 보호소 마커
  const renderShelterMarkers = () => {
    const map = mapRef.current;
    if (!map || shelter.length === 0) return;

    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    if (!bounds) return;

    const sw = bounds.getSW();
    const ne = bounds.getNE();

    // 기존 마커 제거
    shelterMarkers.forEach((marker) => marker.setMap(null));

    // bounds 안에 있는 호텔만 필터
    const filteredCafe = shelter.filter(
      (shelter) =>
        shelter.lat >= sw.lat() &&
        shelter.lat <= ne.lat() &&
        shelter.lng >= sw.lng() &&
        shelter.lng <= ne.lng(),
    );

    // 새 마커 생성
    const newMarkers = filteredCafe.map((shelter) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(shelter.lat, shelter.lng),
        map,
        title: shelter.name,
        icon: {
          url: "/images/map/shelter_marker.png",
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 25),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        setModalData({
          type: "shelter",
          title: shelter.name,
          address: shelter.address,
          phone: shelter.phone,
          description: shelter.category || "",
          charge: "",
          lat: shelter.lat,
          lng: shelter.lng,
          url: "",
          si: "",
          gungu: "",
        });
      });

      return marker;
    });
    setShelterMarkers(newMarkers);
  };
  // 보호소 버튼
  const handleShelterLocation = () => {
    if (!mapRef.current) return;
    if (!isOpen) {
      renderShelterMarkers();
      setIsOpen(true);
    } else {
      shelterMarkers.forEach((marker) => marker.setMap(null));
      setShelterMarkers([]);
      setIsOpen(false);
    }
  };

  // 새로고침 버튼
  const handleRefreshLocation = () => {
    if (!isOpen) return;
    setRefresh(true);

    // 기존 마커 삭제
    shelterMarkers.forEach((marker) => marker.setMap(null));
    setShelterMarkers([]);

    // 다시 렌더링
    renderShelterMarkers();
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
          className={`font-bold flex justify-center items-center px-4 py-2 rounded-2xl transition ${
            currentOpen ? "bg-blue-800 text-white" : "bg-white/60 text-black"
          }`}
          onClick={handleCurrentLocation}
          style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
        >
          {currentOpen ? "현재위치" : "현재위치"}
        </button>
        <button
          className={`font-bold flex justify-center items-center px-4 py-2 rounded-2xl transition ${
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
          className={`font-bold flex justify-center items-center px-4 py-2 rounded-2xl transition
            ${isOpen ? "bg-blue-800 text-white" : "bg-white/60 text-black"}`}
          onClick={handleShelterLocation}
          style={{ position: "absolute", top: 10, left: "60%", zIndex: 999 }}
        >
          {isOpen ? "보호소" : "보호소"}
        </button>
      </div>
    </>
  );
}
