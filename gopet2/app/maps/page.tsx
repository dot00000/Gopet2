"use client";

import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { useToggleNav } from "../hooks/useToggleNav";
import { AiOutlineEnvironment, AiOutlineInfoCircle } from "react-icons/ai";
import { GiPositionMarker } from "react-icons/gi";
import {
  CafeData,
  FoodData,
  HospitalData,
  ParkData,
  useModalStore,
} from "../hooks/useModalStore";
import { selectRegion } from "../hooks/useRegion";
import { useNaverMaps } from "../hooks/useNaverMaps";
import TotalMap from "../components/map/TotalMap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swiper from "swiper";
import "swiper/css";
import { CgWebsite } from "react-icons/cg";
import { LuPhone } from "react-icons/lu";

export default function Maps() {
  const modalData = useModalStore((state) => state.modalData);
  const { regionData } = selectRegion();
  const { mapRef } = useNaverMaps();
  const swiperRef = useRef<Swiper | null>(null);
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  // 지역 선택
  const [selectSido, setSelectSido] = useState("");
  const [selectSigungu, setSelectSigungu] = useState("");

  // 선택된 위치 저장
  const [selectedLocation, setSelectedLocation] = useState<{
    sido: string;
    gungu: string;
  }>({ sido: "", gungu: "" });

  const [hospitalData, setHospitalData] = useState<HospitalData[]>([]);
  const [parkData, setParkData] = useState<ParkData[]>([]);
  const [foodData, setFoodData] = useState<FoodData[]>([]);
  const [cafeData, setCafeData] = useState<CafeData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/kcisa");
        const json = await res.json();
        const hospital: HospitalData[] = (json.data || [])
          .filter((item: any) => item.category2 === "동물병원")
          .map((item: any) => {
            return {
              type: "hospital",
              title: item.title,
              address: item.address,
              description: item.description ?? "",
              charge: item.charge ?? "",
              lat: Number(item.lat),
              lng: Number(item.lng),
              tel: item.tel,
              url: item.url,
              si: item.si,
              gungu: item.gungu,
            };
          });
        const park: ParkData[] = (json.data || [])
          .filter((item: any) => item.category2 === "여행지")
          .map((item: any) => {
            return {
              type: "park",
              title: item.title,
              address: item.address,
              description: item.description ?? "",
              charge: item.charge ?? "",
              lat: Number(item.lat),
              lng: Number(item.lng),
              tel: item.tel,
              url: item.url,
              si: item.si,
              gungu: item.gungu,
            };
          });
        const cafe: CafeData[] = (json.data || [])
          .filter((item: any) => item.category2 === "카페")
          .map((item: any) => {
            return {
              type: "cafe",
              title: item.title,
              address: item.address,
              description: item.description ?? "",
              charge: item.charge ?? "",
              lat: Number(item.lat),
              lng: Number(item.lng),
              tel: item.tel,
              url: item.url,
              si: item.si,
              gungu: item.gungu,
            };
          });
        const food: FoodData[] = (json.data || [])
          .filter((item: any) => item.category2 === "식당")
          .map((item: any) => {
            return {
              type: "food",
              title: item.title,
              address: item.address,
              description: item.description ?? "",
              charge: item.charge ?? "",
              lat: Number(item.lat),
              lng: Number(item.lng),
              tel: item.tel,
              url: item.url,
              si: item.si,
              gungu: item.gungu,
            };
          });
        setHospitalData(hospital);
        setParkData(park);
        setCafeData(cafe);
        setFoodData(food);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // swiper
  useEffect(() => {
    swiperRef.current = new Swiper(".swiper", {
      slidesPerView: "auto",
      initialSlide: 1,
      resistanceRatio: 0,
      on: {
        slideChange(swiper) {
          setOpen(swiper.activeIndex === 0);
        },
      },
    });

    return () => {
      swiperRef.current?.destroy(true, true);
      swiperRef.current = null;
    };
  }, []);

  const toggleMenu = () => {
    if (!swiperRef.current) return;

    if (swiperRef.current.activeIndex === 1) {
      swiperRef.current.slidePrev();
    } else {
      swiperRef.current.slideNext();
    }
  };

  const tabs = [
    {
      id: 0,
      name: "홈",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-center items-center mb-4">
            {modalData && "tel" in modalData && (
              <>
                <div
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-10"
                  style={{ width: "400px", minHeight: "200px" }}
                >
                  <p className="flex justify-center items-center text-xl font-bold m-2">
                    {modalData.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2 text-base">
                      {modalData.address}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineInfoCircle />
                    </span>
                    <span className="ml-2 mb-2 text-base">
                      {modalData.description}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <CgWebsite />
                    </span>
                    <span className="ml-2 mb-2 text-base">{modalData.url}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <LuPhone />
                    </span>
                    <span className="ml-2 mb-2 text-base">{modalData.tel}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ),
    },
    {
      id: 1,
      name: "카페",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-center gap-5">
            <div className="flex rounded-2xl text-xl py-3 mb-5 px-3 mr-2 bg-blue-500 text-white">
              <GiPositionMarker className="text-3xl mr-2" /> 지 역
            </div>
            <select
              value={selectSido}
              onChange={(e) => {
                const newSido = e.target.value;
                setSelectSido(newSido);
                setSelectSigungu("");
              }}
              className={
                "px-3 py-3 mb-5 mr-2 bg-white rounded-2xl hover:bg-gray-200"
              }
            >
              <option value="">시/도 선택</option>
              {Object.keys(regionData).map((sido) => (
                <option key={sido} value={sido}>
                  {sido}
                </option>
              ))}
            </select>
            <select
              value={selectSigungu}
              onChange={(e) => setSelectSigungu(e.target.value)}
              className="px-3 py-3 mb-5 mr-2 bg-white rounded-2xl hover:bg-gray-200"
            >
              <option value="">시/군/구</option>
              {selectSido &&
                regionData[selectSigungu].map((sigungu) => (
                  <option key={sigungu} value={sigungu}>
                    {sigungu}
                  </option>
                ))}
            </select>
          </div>
          <div
            className="flex justify-center items-center mb-5"
            style={{ minHeight: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {cafeData.map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-5 mb-5"
                  style={{ width: "400px", minHeight: "200px" }}
                >
                  <p className="flex justify-center items-center text-lg font-bold m-3">
                    {data.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.address}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineInfoCircle />
                    </span>
                    <span className="ml-2 mb-2 text-base">
                      {data.description}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <CgWebsite />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.url}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <LuPhone />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.tel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      id: 2,
      name: "음식점",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div
            className="flex justify-center items-center mb-5"
            style={{ minHeight: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {foodData.map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-5 mb-5"
                  style={{ width: "400px", minHeight: "200px" }}
                >
                  <p className="flex justify-center items-center text-lg font-bold m-3">
                    {data.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.address}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineInfoCircle />
                    </span>
                    <span className="ml-2 mb-2 text-base">
                      {data.description}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <CgWebsite />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.url}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <LuPhone />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.tel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      id: 3,
      name: "동물병원",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div
            className="flex justify-center items-center mb-5"
            style={{ minHeight: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {hospitalData.map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-5 mb-5"
                  style={{ width: "400px", minHeight: "200px" }}
                >
                  <p className="flex justify-center items-center text-lg font-bold m-3">
                    {data.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.address}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineInfoCircle />
                    </span>
                    <span className="ml-2 mb-2 text-base">
                      {data.description}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <CgWebsite />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.url}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <LuPhone />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.tel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      id: 4,
      name: "공원",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div
            className="flex justify-center items-center mb-5"
            style={{ minHeight: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {parkData.map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-5 mb-5"
                  style={{ width: "400px", minHeight: "200px" }}
                >
                  <p className="flex justify-center items-center text-lg font-bold m-3">
                    {data.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.address}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineInfoCircle />
                    </span>
                    <span className="ml-2 mb-2 text-base">
                      {data.description}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <CgWebsite />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.url}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <LuPhone />
                    </span>
                    <span className="ml-2 mb-2 text-base">{data.tel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <section className="relative min-h-screen">
        <TotalMap
          hospital={hospitalData}
          park={parkData}
          food={foodData}
          cafe={cafeData}
        />
        {/* SideBar (Map 위에 포개짐) */}
        <div className="absolute top-0 left-0 min-h-screen z-10">
          <div className="w-[560px]">
            <div className="swiper relative">
              <div className="swiper-wrapper">
                <div className="swiper-slide menu h-full">
                  <ul className="flex justify-start items-center py-5">
                    {tabs.map((tab) => (
                      <li
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex space-x-2 w3-bar-item w3-button ml-5 py-2 px-3 text-xl bg-white rounded-2xl hover:bg-gray-200 
                  ${activeTab === tab.id ? "active bg-gray-300" : ""}`}
                      >
                        {tab.name}
                      </li>
                    ))}
                  </ul>
                  {tabs
                    .filter((tab) => activeTab === tab.id)
                    .map((tab) => (
                      <div key={tab.id}>{tab.content}</div>
                    ))}
                </div>

                <div className="swiper-slide submenu">
                  {/* 메뉴 버튼 영역 */}
                  <div>
                    <div
                      className={`menu-button ${open ? "cross" : ""}`}
                      onClick={toggleMenu}
                    >
                      <span className="bar" />
                      <span className="bar" />
                      <span className="bar" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}
