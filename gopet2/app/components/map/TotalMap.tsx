"use client";
import Script from "next/script";
import { useNaverMaps } from "../../hooks/useNaverMaps";
import { useEffect, useRef, useState } from "react";
import { useModalStore } from "../../hooks/useModalStore";
import KcisaApi from "@/app/api/KcisaApi";

type PlaceType = "hospital" | "park" | "cafe" | "food";

const markerIcons: Record<PlaceType, string> = {
  hospital: "/picture_images/map/animalhospital_marker.png",
  park: "/picture_images/map/park_marker.png",
  cafe: "/picture_images/map/cafe_marker.png",
  food: "/picture_images/map/food_marker.png",
};

export default function TotalMap({ mapId = "map" }) {
  const { initMap, mapRef, infoRaf } = useNaverMaps();

  useEffect(() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);

  // 모달
  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  // 마커 상태
  const [hospitalMarkers, setHospitalMarkers] = useState<naver.maps.Marker[]>([]);
  const [parkMarkers, setParkMarkers] = useState<naver.maps.Marker[]>([]);
  const [cafeMarkers, setCafeMarkers] = useState<naver.maps.Marker[]>([]);
  const [foodMarkers, setFoodMarkers] = useState<naver.maps.Marker[]>([]);

  // 현재 위치 마커
  const [currentLocation, setCurrentLocation] = useState<naver.maps.Marker | null>(null);

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

  // 좌표 → 주소 변환
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

  //마커 표시
  const showMarkers = async (type: PlaceType, keyword: string) => {
    const map = mapRef.current;
    if (!map) return;

    // 타입별 기존 마커 제거
    const clearMarkers = (markers: naver.maps.Marker[]) =>
      markers.forEach((marker) => marker.setMap(null));

    let currentMarkers: naver.maps.Marker[] = [];
    switch (type) {
      case "hospital":
        currentMarkers = hospitalMarkers;
        break;
      case "cafe":
        currentMarkers = cafeMarkers;
        break;
      case "food":
        currentMarkers = foodMarkers;
        break;
      case "park":
        currentMarkers = parkMarkers;
        break;
    }

    if (currentMarkers.length > 0) {
      clearMarkers(currentMarkers);
      switch (type) {
        case "hospital":
          setHospitalMarkers([]);
          break;
        case "cafe":
          setCafeMarkers([]);
          break;
        case "food":
          setFoodMarkers([]);
          break;
        case "park":
          setParkMarkers([]);
          break;
      }
      return;
    }

    // 데이터 가져오기
    const results = await KcisaApi(keyword);

    const bounds = map.getBounds() as naver.maps.LatLngBounds;
    const sw = bounds.getSW();
    const ne = bounds.getNE();

    const filtered = results.filter((item: any) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);
      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= sw.lat() &&
        lat <= ne.lat() &&
        lng >= sw.lng() &&
        lng <= ne.lng()
      );
    });

    const newMarkers: naver.maps.Marker[] = [];

    filtered.forEach((item: any) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(item.lat, item.lng),
        map,
        title: item.title,
        icon: {
          url: markerIcons[type],
          scaledSize: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 25),
        },
      });

      naver.maps.Event.addListener(marker, "click", async () => {
        const latlng = new naver.maps.LatLng(item.lat, item.lng);
        const { address, cityName } = await searchCoordinateToAddress(latlng, item.title);
        setModalData({
          type: item.type,
          title: item.title,
          address,
          region: cityName,
          phone: item.tel,
          url: item.url,
          charge: item.charge,
          description: item.description,
        });
      });

      newMarkers.push(marker);
    });

    // 상태 저장
    switch (type) {
      case "hospital":
        setHospitalMarkers(newMarkers);
        break;
      case "cafe":
        setCafeMarkers(newMarkers);
        break;
      case "food":
        setFoodMarkers(newMarkers);
        break;
      case "park":
        setParkMarkers(newMarkers);
        break;
    }
  };

  //버튼 클릭 핸들러
  const handleHospitalLocationClick = () => showMarkers("hospital", "동물병원");
  const handleParkLocationClick = () => showMarkers("park", "여행지");
  const handleCafeLocationClick = () => showMarkers("cafe", "카페");
  const handleFoodLocationClick = () => showMarkers("food", "식당");

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
          onClick={handleCafeLocationClick}
          style={{ position: "absolute", top: 10, left: "30%", zIndex: 999 }}
        >
          카페
        </button>
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          onClick={handleFoodLocationClick}
          style={{ position: "absolute", top: 10, left: "40%", zIndex: 999 }}
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
          onClick={handleHospitalLocationClick}
          style={{ position: "absolute", top: 10, left: "60%", zIndex: 999 }}
        >
          동물병원
        </button>
        <button
          className="flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black"
          onClick={handleParkLocationClick}
          style={{ position: "absolute", top: 10, left: "70%", zIndex: 999 }}
        >
          공원
        </button>
      </div>
    </>
  );
}
