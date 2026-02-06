"use client";

import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { useToggleNav } from "../hooks/useToggleNav";
import { AiOutlineEnvironment } from "react-icons/ai";
import { GiPositionMarker, GiRotaryPhone } from "react-icons/gi";
import { useModalStore } from "../hooks/useModalStore";
import { selectRegion } from "../hooks/useRegion";
import KcisaApi from "../api/KcisaApi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swiper from "swiper";
import "swiper/css";
import TotalMap from "../components/map/TotalMap";
import { useNaverMaps } from "../hooks/useNaverMaps";

interface ModalData {
  type: string;
  name: string;
  address: string;
  phone: string;
}

export default function Maps() {
  const modalData = useModalStore((state) => state.modalData);
  const { regionData } = selectRegion(); 
  const { mapRef } = useNaverMaps();
  const swiperRef = useRef<Swiper | null>(null);
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  // 지역 선택
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectSido, setSelectSido] = useState("");
  const [selectSigungu, setSelectSigungu] = useState("");


  // 선택된 위치 저장
  const [selectedLocation, setSelectedLocation] = useState<{
    sido: string;
    gungu: string;
  }>({ sido: "", gungu: "" });


  // 병원 data 가져오기
  const [hospitalData, setHospitalData] = useState<ModalData[]>([]);
  const [parkData, setParkData] = useState<ModalData[]>([]);
  const [foodData, setFoodData] = useState<ModalData[]>([]);
  const [cafeData, setCafeData] = useState<ModalData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await KcisaApi();
        const hospitalData = results
          .filter((data: any) => data.category2 === "동물병원")
          .map((data: any) => {
            return {
              type: "hospital",
              title: data.title,
              address: data.address,
              description: data.description,
              tel: data.tel,
              url: data.url,
              si: data.si,
              gungu: data.gungu,
            };
          });
        const parkData = results
          .filter((data: any) => data.category2 === "여행지")
          .map((data: any) => {
            return {
              type: "park",
              title: data.title,
              address: data.address,
              description: data.description,
              tel: data.tel,
              url: data.url,
              si: data.si,
              gungu: data.gungu,
            };
          });
        const cafeData = results
          .filter((data: any) => data.category2 === "카페")
          .map((data: any) => {
            return {
              type: "cafe",
              title: data.title,
              address: data.address,
              description: data.description,
              tel: data.tel,
              url: data.url,
              si: data.si,
              gungu: data.gungu,
            };
          });
        const foodData = results
          .filter((data: any) => data.category2 === "식당")
          .map((data: any) => {
            return {
              type: "food",
              title: data.title,
              address: data.address,
              description: data.description,
              tel: data.tel,
              url: data.url,
              si: data.si,
              gungu: data.gungu,
            };
          });
        setHospitalData(hospitalData);
        setParkData(parkData);
        setCafeData(cafeData);
        setFoodData(foodData);
      } catch (error) {
        console.log(error);
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
            {modalData && (
              <>
                <div
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-10"
                  style={{ width: "400px", height: "180px" }}
                >
                  <p className="flex justify-center items-center text-xl font-bold m-2">
                    {modalData.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2">{modalData.address}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl">
                      <GiRotaryPhone />
                    </span>
                    {/* <span className="ml-2">{modalData.}</span> */}
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
            <div className="flex justify-center gap-5 mb-5">
              <div className="flex rounded-2xl text-xl py-3 mb-5 px-3 mr-2 bg-blue-500 text-white">
                <GiPositionMarker className="text-3xl mr-2"/> 지 역
              </div>
                <select
                  value={selectSido}
                  onChange={(e) => {
                    const newSido = e.target.value;
                    setSelectSido(newSido);
                    setSelectSigungu("");
                  }}
                  className={"px-3 py-3 mb-5 mr-2 bg-white rounded-2xl hover:bg-gray-200"}
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
                  {selectSido && regionData[selectSigungu].map((sigungu) => (
                    <option key={sigungu} value={sigungu}>
                      {sigungu}
                    </option>
                  ))}
                </select>
          </div>
          <div
            className="flex justify-center items-center mb-5"
            style={{ height: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {cafeData?.length > 0 &&
                cafeData.map((data: any, index: any) => (
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
                      <span className="text-xl">
                        <AiOutlineEnvironment />
                      </span>
                      <span className="ml-2 mb-2 text-base">
                        {data.address}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        Tel : {data.tel}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        {data.description}
                      </span>
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
            style={{ height: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {foodData?.length > 0 &&
                foodData.map((data: any, index: any) => (
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
                      <span className="text-xl">
                        <AiOutlineEnvironment />
                      </span>
                      <span className="ml-2 mb-2 text-base">
                        {data.address}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        Tel : {data.tel}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        {data.description}
                      </span>
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
            style={{ height: "1000px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {hospitalData?.length > 0 &&
                hospitalData.map((data: any, index: any) => (
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
                      <span className="text-xl">
                        <AiOutlineEnvironment />
                      </span>
                      <span className="ml-2 mb-2 text-base">
                        {data.address}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        {data.description}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        Tel : {data.tel}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 text-base">{data.url}</span>
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
            style={{ height: "900px", overflowY: "auto" }}
          >
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {parkData?.length > 0 &&
                parkData.map((data: any, index: any) => (
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
                      <span className="text-xl">
                        <AiOutlineEnvironment />
                      </span>
                      <span className="ml-2 mb-2 text-base">
                        {data.address}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        Tel : {data.tel}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2 text-base">
                        {data.description}
                      </span>
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
        <TotalMap />
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
