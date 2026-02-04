"use client";
import Script from "next/script";
import { useNaverMaps } from "../../hooks/useNaverMaps";
import { useEffect, useRef, useState } from "react";
import { useModalStore } from "../../hooks/useModalStore";
import KorPetTourApi from "@/app/api/KorPetTourApi";


export default function HotelMap({ mapId = "map" }) {
  const { initMap, mapRef, infoRaf } = useNaverMaps();

  useEffect(() => {
    if (!window.naver) return;
    initMap(mapId);
  }, [mapId, initMap]);

  const [currentOpen, setCurrentOpen] = useState(false);
  const [cacheApi, setCacheApi] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shelterMarkers, setShelterMarkers] = useState<naver.maps.Marker[]>([]);
  const hasSetIdleListener = useRef(false);
  const [hotelMarkers, setHotelMarkers] = useState<naver.maps.Marker[]>([]);
  const modalData = useModalStore((state) => state.modalData);
  const setModalData = useModalStore((state) => state.setModalData);

  // 현재 위치 on/off
  const [currentLocation, setCurrentLocation] =
    useState<naver.maps.Marker | null>(null);
//   useEffect(() => {
//     const shelterData = shelter.map((data: any) => ({
//       name: data.name,
//       address: data.address,
//       phone: data.phone,
//     }));
//     shelterData;
//   }, []);

  async function searchCoordinateToAddress(
    latlng: naver.maps.LatLng,
    title?: string,
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
        },
      );
    });
  }

  type PlaceType = "hotel";
  const markerIcons: Record<PlaceType, string> = {
    hotel: "/images/map/hotel_marker.png",
  };

  // 호텔 위치
  const handleHotelLocation = async(type: PlaceType, keyword: string) => {
    const map = mapRef.current;
    if (!map) return;
    if (!hasSetIdleListener.current) {
      window.naver.maps.Event.addListener(map, "idle", () => {
        handleHotelLocation(type, keyword);
      });
      hasSetIdleListener.current = true;
    }

    const results = cacheApi ?? (await KorPetTourApi(keyword));
    if (!cacheApi) {
      setCacheApi(results);
    }
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

    // 마커생성
    filtered.forEach((item: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.lat, item.lng),
          map,
          title: item.title,
          icon: {
            url: markerIcons[type],
            scaledSize: new window.naver.maps.Size(50, 50),
            anchor: new window.naver.maps.Point(25, 25),
          },
        });
         window.naver.maps.Event.addListener(marker, "click", async () => {
          const latlng = new window.naver.maps.LatLng(item.lat, item.lng);
          const { address, cityName } = await searchCoordinateToAddress(
            latlng,
            item.title
          );
          setModalData({
            title: item.title,
            address: address,
            region: cityName,
            phone: item.tel,
            url: item.url,
            charge: item.charge,
            description: item.description,
          });
        });
        
        newMarkers.push(marker);
        // 기존 마커를 새 마커가 렌더된 후 제거
      });
      if(type === "hotel"){
        return setHotelMarkers(newMarkers);
      }
    }
  // 마커 버튼 

  // 현재 위치 마커
  const handleCurrentLocation = async(type: PlaceType, keyword: string) => {
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
          className={`flex justify-center items-center px-4 py-2 rounded-2xl transition ${
            currentOpen ? "bg-blue-800 text-white" : "bg-white/60 text-black"
          }`}
          onClick={handleCurrentLocation}
          style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
        >
          {currentOpen ? "현재위치" : "현재위치"}
        </button>

        <button
          className={`flex justify-center items-center px-4 py-2 rounded-2xl transition
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
