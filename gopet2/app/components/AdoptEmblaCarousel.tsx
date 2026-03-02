"use client";

import React, { useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import abandonarni from "../assets/json/abandonanimal.json";
import "./css/embla.css";
import Link from "next/link";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

interface SlideData {
  state: string;
  kg: any;
  age: string;
  img: any;
  shelter: string;
  address: string;
  enddate: number;
}

const AdoptEmblaCarousel: React.FC<PropType> = (props) => {
  const [adoptData, setAdoptData] = useState<SlideData[]>([]);
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({
      playOnInit: false,
      stopOnMouseEnter: false,
      stopOnInteraction: false,
    }),
  ]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const adoptData = (abandonarni as any[])
      .filter((data) => data.STATE_NM === "보호중")
      .slice(0, 8)
      .map((data: any) => ({
        state: data.STATE_NM, // 보호중
        enddate: data.PBLANC_END_DE,
        age: data.AGE_INFO,
        kg: data.BDWGH_INFO,
        img: data.IMAGE_COURS,
        sex: data.SEX_NM,
        shelter: data.SLTR_NM,
        address: data.REFINE_LOTNO_ADDR,
      }));
    setAdoptData(adoptData);

    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    autoScroll.play();

    setIsPlaying(autoScroll.isPlaying());
    emblaApi
      .on("autoScroll:play", () => setIsPlaying(true))
      .on("reInit", () => setIsPlaying(autoScroll.isPlaying()));
  }, [emblaApi]);

  return (
    <>
      <section className="relative flex flex-col items-center justify-center py-24 overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-[1600px]">
          <Link href="/adoption" className="flex text-3xl font-bold mb-4">
            <h2 className="mr-3">입양을 기다리는 아이들</h2>
            <img src="/images/footprint.png" alt="" className="w-10 h-10" />
          </Link>

          <h5 className="text-xl mb-10 text-center">당신의 가족이 되어줄 친구들을 만나보세요</h5>

          <div className="flex w-full gap-4 itmes-start">
            <div className="embla flex-1 min-w-0">
              <div className="embla__viewport overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex">
                  {adoptData.map((data: any, index: number) => (
                    <div className="embla__slide flex-[240px] pr-4" key={index}>
                      <div className="flex flex-col rounded-2xl bg-white w-full h-[340px] p-4 shadow-sm border border-gray-100">
                        <div
                          className="w-full h-[180px] rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${data.img})` }}
                        />
                        <div className="flex flex-col text-base mt-3 space-y-1">
                          <span className="font-bold text-gray-800">
                            {data.state}
                          </span>
                          <span className="text-gray-500">
                            {data.age} | {data.kg}
                          </span>
                          <span className="text-gray-600">{data.shelter}</span>
                          <span className="flex items-center justify-center text-sm text-[#477b6a] bg-[#e0e4dc] px-3 py-1 rounded-full font-medium mx-auto mt-2">
                            공고종료일 : {data.enddate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 오른쪽 배너 카드 */}
            <div className="relative flex-shrink-0 items-center justify-between rounded-3xl bg-[#f2ece7] w-[240px] h-[340px] px-8 py-6 overflow-hidden shadow-md">
              <div className="flex flex-col z-10 mt-2">
                <p className="text-md text-gray-600 mb-2">
                  사랑스러운 친구들이
                </p>
                <h3 className="text-2xl font-bold leading-snug mb-4">
                  당신을 <br/>기다리고 있어요!
                </h3>
                <Link href="/adoption" className="w-fit bg-[#477b6a] text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
                보호소 입양 바로가기
                </Link>
              </div>
              <img
                className="absolute pb-5 right-6 bottom-0 w-[170px] h-auto object-contain"
                src="/images/pats.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdoptEmblaCarousel;
