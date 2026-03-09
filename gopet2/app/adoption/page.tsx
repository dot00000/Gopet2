"use client";

import { useToggleNav } from "../hooks/useToggleNav";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Header from "../components/Header";
import Image from "next/image";

export interface AnimalData {
  identify: string;
  state: string;
  image: string;
  weight: string;
  age: string;
  begindate: string;
  enddate: string;
  sex: string;
  lat: number;
  long: number;
  tel: string;
  shelter: string;
}

const Adoption = () => {
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const [animalData, setAnimalData] = useState<AnimalData[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const pageLimit = 5;
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/animals");
        const data = await res.json();
        const filtered = (data.data || [])
          .filter((item: any) => {
            const protecting = item.STATE_NM._text === "보호중";
            const notExpired = String(item.PBLANC_END_DE) >= today;
            return protecting && notExpired;
          })
          .map((item: any) => ({
            number: item.PBLANC_IDNTFY_NO?._text,
            state: item.STATE_NM?._text,
            img: item.IMAGE_COURS?._text,
            kg: item.BDWGH_INFO?._text,
            age: item.AGE_INFO?._text,
            begindate: item.PBLANC_BEGIN_DE?._text,
            enddate: item.PBLANC_END_DE?._text,
            sex: item.SEX_NM?._text,
            lat: parseFloat(item.REFINE_WGS84_LAT?._text),
            lng: parseFloat(item.REFINE_WGS84_LOGT?._text),
            tel: item.SHTER_TELNO?._text,
            shelter: item.SHTER_NM?._text,
          }));
        setAnimalData(filtered);
      } catch (e) {
        console.error(e);
        setAnimalData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // pagination 데이터
  const totalItems = animalData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = animalData?.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 그룹
  const currentPageGroup = Math.floor((currentPage - 1) / pageLimit);
  const startPage = currentPageGroup * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <>
      <Header/>
      <h1 className="flex justify-center text-2xl md:text-3xl mb-10 mt-10 font-bold">
        💗 보호소 입양
      </h1>

      {/* 카드 리스트 섹션 */}
      <section className="flex justify-center items-start min-h-[700px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 w-full max-w-7xl px-10">
          {currentItems?.map((data: any, index: number) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start rounded-3xl mb-10 bg-[#ffffff] p-10 w-full h-auto md:h-[330px]"
            >
              {/* 텍스트 정보 */}
              <div className="flex flex-col items-start text-black text-base space-y-1 mr-5 w-full md:w-[360px]">
                <div className="flex mb-5 font-bold">
                  <span className="mr-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-base md:text-lg bg-green-100 text-green-800 font-bold">
                    {data.state}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-base md:text-lg ${data.sex === "F" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {data.sex === "F" ? "암컷" : "수컷"}
                  </span>
                </div>
                <div className="flex flex-col text-sm md:text-base space-y-2">
                  <span className="font-bold">{data.number}</span>
                  <span>나 이 : {data.age}</span>
                  <span>체 중 : {data.kg}</span>
                  <span>보호소명 : {data.shelter}</span>
                  <span>전화번호 : {data.tel}</span>
                  <span>
                    기간 : {data.begindate}~{data.enddate}
                  </span>
                </div>
              </div>

              {/* 이미지 */}
              <div className="flex items-center justify-center w-full md:w-1/2 mt-5 md:mt-0">
                <div className="relative w-full aspect-square md:w-[250px] md:h-[250px] rounded-[20px] overflow-hidden">
                  <Image src={data.img} alt="" fill className="object-cover" unoptimized={true} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 페이지네이션 섹션 */}
      <section className="flex justify-center items-center space-x-2 my-5 pb-20">
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
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
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
    </>
  );
};

export default Adoption;
