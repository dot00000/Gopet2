"use client";

import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { useToggleNav } from "../hooks/useToggleNav";
import { AiOutlineEnvironment, AiOutlineInfoCircle } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useModalStore } from "../hooks/useModalStore";
import { HotelData } from "../hooks/useModalStore";
import HotelMap from "../components/map/HotelMap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swiper from "swiper";;
import "swiper/css";
import { LuPhone } from "react-icons/lu";

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
  const [hotelData, setHotelData] = useState<HotelData[]>([]);
  // 호텔 data가져오기
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
          }));
        setHotelData(hotels);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHotels();
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

  // pagination
  const totalItems = hotelData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = hotelData.slice(startIndex, startIndex + itemsPerPage);

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
            {modalData && 'tel' in modalData && (
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
                    <span className="ml-2 mb-2 text-base">{modalData.address}</span>
                  </div>
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineInfoCircle />
                    </span>
                    <span className="ml-2 mb-2 text-base">{modalData.description}</span>
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
      )
    },
    {
      id: 1,
      name: "전체리스트",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-center items-center mb-5">
            <div className="flex flex-col items-center mb-4 no-scrollbar">
              {currentItems.map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-10"
                  style={{ width: "400px", minHeight: "200px" }}
                >
                    <p className="flex justify-center items-center text-xl font-bold m-2">
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
                    <span className="ml-2 mb-2 text-base">{data.description}</span>
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

              {/* pagination */}
              <section className="flex justify-center items-center space-x-2 my-15">
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
                      window.scrollTo(0, 0); // 페이지 이동 시 상단으로
                    }}
                    className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${
                      currentPage === number
                        ? "bg-blue-800 text-white scale-110"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
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
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <section className="relative min-h-screen">
        <HotelMap hotels={hotelData} />
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
