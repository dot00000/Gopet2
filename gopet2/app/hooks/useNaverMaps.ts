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


// 마커 변경하기
// export function createMarker() {
//     const markerRef = useRef<naver.maps.Marker[]>([]);
// }

// 좌표값을 주소로 
// export async function searchCoordinateToAddress(
//     latlng: naver.maps.LatLng,
//     title?: string,
//   ): Promise<{ address: string; cityName: string }> {
    
//     return new Promise((resolve, reject) => {
//       naver.maps.Service.reverseGeocode(
//         {
//           coords: latlng,
//           orders: [
//             naver.maps.Service.OrderType.ADDR,
//             naver.maps.Service.OrderType.ROAD_ADDR,
//           ].join(","),
//         },
//         function (status, response) {
//           if (status === naver.maps.Service.Status.ERROR) {
//             reject("주소 조회 실패");
//             return;
//           }
//           const items = response?.v2?.results || [];
//           if (items.length === 0) {
//             resolve({ address: "주소 없음", cityName: "도시 정보 없음" });
//             return;
//           }
//           const item = items[0];
//           const cityName = item.region.area1.name;
//           const address =
//             item.region.area1.name +
//             " " +
//             item.region.area2.name +
//             " " +
//             item.region.area3.name +
//             " " +
//             item.region.area4.name +
//             (item.land.number1 ? " " + item.land.number1 : "") +
//             (item.land.number2 ? "-" + item.land.number2 : "") +
//             (item.land.addition0?.value ? " " + item.land.addition0.value : "");
//           const contentHtml = `
//             <div style="position:relative;padding:10px;min-width:150px;min-height:80px;line-height:140%;font-size:12px;">
//               <h1>${title || "정보없음"}</h1>
//               <p>주소 : ${address}</p>
//             </div>
//           `;
//           infoRef.current?.setContent(contentHtml);
//           infoRef.current?.open(mapRef.current!, latlng);

//           resolve({ address, cityName });
//         },
//       );
//     });
//   }

  // export async function showMarkers(type: PlaceType, keyword: string) {
  //     const [hospitalMarkers, setHospitalMarkers] = useState<naver.maps.Marker[]>([]);
  //     const [cafeMarkers, setCafeMarkers] = useState<naver.maps.Marker[]>([]);
  //     const [foodMarkers, setFoodMarkers] = useState<naver.maps.Marker[]>([]);
  //     const [parkMarkers, setParkMarkers] = useState<naver.maps.Marker[]>([]);
  
  //     const [modalData, setModalData] = useState<null | {
  //   type: "hospital" | "cafe" | "food" | "park";
  //   title: string;
  //   address?: string;
  //   region?: string;
  //   phone: string;
  //   description: string;
  //   charge: string;
  //   url: string;
  // }>(null);
  
  //     const hasSetIdleListener = useRef(false);
  //     const map = mapRef.current;
  //     if (!map) return;
  
  //     if (!hasSetIdleListener.current) {
  //       window.naver.maps.Event.addListener(map, "idle", () => {
  //         showMarkers(type, keyword);
  //       });
  //       hasSetIdleListener.current = true;
  //     }
  
  //     // 타입별 기존 마커 제거
  //     const clearMarkers = (markers: naver.maps.Marker[]) => {
  //       markers.forEach((marker) => marker.setMap(null));
  //     };
  
  //     // 타입별로 현재 상태 참조
  //     let currentMarkers: naver.maps.Marker[] = [];
  //     switch (type) {
  //       case "hospital":
  //         currentMarkers = hospitalMarkers;
  //         break;
  //       case "cafe":
  //         currentMarkers = cafeMarkers;
  //         break;
  //       case "food":
  //         currentMarkers = foodMarkers;
  //         break;
  //       case "park":
  //         currentMarkers = parkMarkers;
  //         break;
  //     }
  
  //     // 이미 마커가 있다면 제거하고 종료 (토글 기능)
  //     if (currentMarkers.length > 0) {
  //       clearMarkers(currentMarkers);
  //       switch (type) {
  //         case "hospital":
  //           setHospitalMarkers([]);
  //           break;
  //         case "cafe":
  //           setCafeMarkers([]);
  //           break;
  //         case "food":
  //           setFoodMarkers([]);
  //           break;
  //         case "park":
  //           setParkMarkers([]);
  //           break;
  //       }
  //       return;
  //     }
  
  //     // 데이터 가져오기
  //     const results = await KcisaApi(keyword);
  
  //     const bounds = map.getBounds() as naver.maps.LatLngBounds;
  //     const sw = bounds.getSW();
  //     const ne = bounds.getNE();
  
  //     const filtered = results.filter((item: any) => {
  //       const lat = parseFloat(item.lat);
  //       const lng = parseFloat(item.lng);
  //       return (
  //         !isNaN(lat) &&
  //         !isNaN(lng) &&
  //         lat >= sw.lat() &&
  //         lat <= ne.lat() &&
  //         lng >= sw.lng() &&
  //         lng <= ne.lng()
  //       );
  //     });
  
  //     const newMarkers: naver.maps.Marker[] = [];
  
  //     filtered.forEach((item: any) => {
  //       const marker = new window.naver.maps.Marker({
  //         position: new window.naver.maps.LatLng(item.lat, item.lng),
  //         map,
  //         title: item.title,
  //         icon: {
  //           url: markerIcons[type],
  //           scaledSize: new window.naver.maps.Size(50, 50),
  //           anchor: new window.naver.maps.Point(25, 25),
  //         },
  //       });
  
  //       window.naver.maps.Event.addListener(marker, "click", async () => {
  //         const latlng = new window.naver.maps.LatLng(item.lat, item.lng);
  //         const { address, cityName } = await searchCoordinateToAddress(
  //           latlng,
  //           item.title
  //         );
  //         setModalData({
  //           type,
  //           title: item.title,
  //           address,
  //           region: cityName,
  //           phone: item.tel,
  //           url: item.url,
  //           charge: item.charge,
  //           description: item.description,
  //         });
  //       });
  
  //       newMarkers.push(marker);
  //     });
  
  //     // 타입별로 저장
  //     switch (type) {
  //       case "hospital":
  //         setHospitalMarkers(newMarkers);
  //         break;
  //       case "cafe":
  //         setCafeMarkers(newMarkers);
  //         break;
  //       case "food":
  //         setFoodMarkers(newMarkers);
  //         break;
  //       case "park":
  //         setParkMarkers(newMarkers);
  //         break;
  //     }
  