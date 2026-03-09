"use client";

import { useEffect, useRef, useState } from "react";
import { useToggleNav } from "../hooks/useToggleNav";
import { AiOutlineEnvironment, AiOutlineInfoCircle } from "react-icons/ai";
import { LuPhone } from "react-icons/lu";
import { GiPositionMarker } from "react-icons/gi";
import { CgWebsite } from "react-icons/cg";
import { IoIosArrowBack, IoMdInformationCircleOutline } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useModalStore } from "../hooks/useModalStore";
import { HotelData } from "../hooks/useModalStore";
import { selectRegion } from "../hooks/useRegion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swiper from "swiper";
import "swiper/css";
import HotelMarker from "../components/marker/HotelMarker";

export default function Hotel() {
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const swiperRef = useRef<Swiper | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const pageLimit = 5;
  const modalData = useModalStore((state) => state.modalData);

  // 지역 선택
  const { regionData } = selectRegion();
  const [selectSido, setSelectSido] = useState("");
  const [selectSigungu, setSelectSigungu] = useState("");

  // 선택된 위치 저장
  const [selectedLocation, setSelectedLocation] = useState<{
    si: string;
    gungu: string;
  }>({ si: "", gungu: "" });

  // 호텔 data가져오기
  const [hotelData, setHotelData] = useState<HotelData[]>([]);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/kcisa");
        const json = await res.json();
        const hotels: HotelData[] = (json.data || [])
          .filter((item: any) => item.category2 === "펜션")
          .map((item: any) => ({
            type: "hotel",
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
          }));
        console.log(json);
        
        setHotelData(hotels);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHotels();
  }, []);
  
  const filteredData = hotelData.filter((data) => {
    if (!selectedLocation.si) return true;
    if (selectedLocation.si && !selectedLocation.gungu) {
      return data.si === selectedLocation.si;
    }
    return data.si === selectedLocation.si && data.gungu === selectedLocation.gungu
  });
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

  // pagination
  const totalItems = filteredData.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 그룹
  const currentPageGroup = Math.floor((currentPage - 1) / pageLimit);
  const startPage = currentPageGroup * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

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
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-5 break-all"
                  style={{ maxWidth: "400px", minHeight: "200px" }}
                >
                  <p className="flex justify-center items-center text-xl font-bold m-2">
                    {modalData.title}
                  </p>
                  <hr className="border-t border-gray-300 my-2" />
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
                    <a
                      href={modalData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 mb-2 text-base hover:underline cursor-pointer"
                    >
                      {modalData.url ? modalData.url : "홈페이지 없음"}
                    </a>
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
      name: "전체리스트",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex font-bold text-lg justify-center gap-3">
            <div className="flex rounded-4xl py-2 mb-5 px-3 bg-[#111828] text-white">
              <GiPositionMarker className="text-3xl mr-1" /> 지 역</div>
            <select
              value={selectSido}
              onChange={(e) => {
                const newSido = e.target.value;
                setSelectSido(newSido);
                setSelectSigungu("");
              }}
              className={
                "px-3 mb-5 bg-white rounded-4xl hover:bg-gray-200"
              }
            >
              <option value="">시/도 선택</option>
              {Object.keys(regionData).map((si) => (
                <option key={si} value={si}>
                  {si}
                </option>
              ))}
            </select>
            <select
              value={selectSigungu}
              onChange={(e) => setSelectSigungu(e.target.value)}
              className="px-3 py-3 mb-5 bg-white rounded-4xl hover:bg-gray-200"
            >
              <option value="">시/군/구</option>
              {selectSido &&
                regionData[selectSido]?.map((gungu) => (
                  <option key={gungu} value={gungu}>
                    {gungu}
                  </option>
                ))}
            </select>
          <button type="button" onClick={(e) => {
            e.preventDefault();
            setSelectedLocation({
              si: selectSido,
              gungu: selectSigungu,
            });
            setCurrentPage(1); // 리셋 
          }} className="flex rounded-4xl text-lg py-2 mb-5 px-4 bg-[#111828] text-white cursor-pointer">
            검색
          </button>
          </div>
          <div className="flex flex-col items-center h-[800px]">
            <div className="flex flex-col items-center flex-1 overflow-y-auto no-scrollbar p-5">
              {currentItems.filter((data) => data.si === selectedLocation.si && data.gungu === selectedLocation.gungu).map((data: any, index: any) => (
                <div key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-5 break-all"
                  style={{ maxWidth: "400px"}}
                >
                  <p className="flex justify-center text-xl font-bold m-2">
                    {data.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex py-1">
                    <AiOutlineEnvironment className="text-2xl" />
                    <span className="ml-2">{data.address}</span>
                  </div>

                  <div className="flex py-1">
                    <IoMdInformationCircleOutline className="text-2xl flex-shrink-0"/>
                    <span className="ml-2">{data.description}</span>
                  </div>

                  <div className="flex py-1">
                    <CgWebsite className="text-2xl" />
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 hover:underline"
                    >
                      {data.url ? data.url : "홈페이지 없음"}
                    </a>
                  </div>

                  <div className="flex">
                    <LuPhone className="text-2xl" />
                    <span className="ml-2">{data.tel}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* pagination */}
            <section className="py-4 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(startPage - 1)}
                disabled={startPage === 1}
                className="p-2 bg-gray-200 rounded-lg disabled:opacity-30"
              >
                <IoIosArrowBack />
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => {
                    setCurrentPage(number);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    currentPage === number
                      ? "bg-blue-800 text-white"
                      : "bg-white border text-gray-600"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(endPage + 1)}
                disabled={endPage === totalPages}
                className="p-2 bg-gray-200 rounded-lg disabled:opacity-30"
              >
                <IoIosArrowForward />
              </button>
            </section>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <Header />
      <section className="relative min-h-screen">
        <HotelMarker hotels={hotelData} />
        {/* SideBar (Map 위에 포개짐) */}
        <div className="absolute top-0 left-0 min-h-screen z-10">
          <div className="w-[560px]">
            <div className="swiper relative">
              <div className="swiper-wrapper">
                <div className="swiper-slide menu h-full">
                  <ul className="flex justify-start items-center mt-3 ml-3 p-0">
                    {tabs.map((tab) => (
                      <li
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex font-bold space-x-2 w3-bar-item w3-button ml-5 py-2 px-3 text-lg bg-white rounded-4xl hover:bg-gray-200 
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
                      className={`menu-button rounded-lg ${open ? "cross" : ""}`}
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
