"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Keyboard, Scrollbar, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const Festival = () => {
  return (
    <>
      <section className="relative">
        <div className="relative z-10 p-2">
          <div className="flex mt-15 justify-center text-3xl font-bold mb-4">
            <h2 className="mr-3">반려동물 축제</h2>
            <img src="/images/footprint.png" alt="" className="w-10 h-10" />
          </div>
          <div className="pt-10 flex justify-center relative">
            <Swiper
              slidesPerView={2}
              centeredSlides={false}
              slidesPerGroupSkip={1}
              grabCursor={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              keyboard={{
                enabled: true,
              }}
              breakpoints={{
                769: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                },
              }}
              scrollbar={false}
              navigation={false}
              pagination={{ clickable: true }}
              modules={[Keyboard, Scrollbar, Pagination, Autoplay]}
              className="mySwiper "
              style={{ width: "70%", height: "280px" }}
            >
              <SwiperSlide>
                <a href="https://ilovepets.co.kr/?main=0">
                  <div
                    className="relative ml-8 rounded-2xl overflow-hidden"
                    style={{ width: "90%", height: "220px" }}
                  >
                    <Image
                      src="/images/festival/petandmore.png"
                      alt=""
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="https://www.pet-show.co.kr/#__890105__item1">
                  <div
                    className="relative ml-8 rounded-2xl overflow-hidden"
                    style={{ width: "90%", height: "220px" }}
                  >
                    <Image
                      src="/images/festival/petshow.jpg"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="https://www.mypetfair.co.kr/">
                  <div
                    className="relative ml-8 rounded-2xl overflow-hidden"
                    style={{ width: "90%", height: "220px" }}
                  >
                    <Image
                      src="/images/festival/songdo.jpg"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="https://cat-show.co.kr/">
                  <div
                    className="relative ml-8 rounded-2xl overflow-hidden"
                    style={{ width: "90%", height: "220px" }}
                  >
                    <Image
                      src="/images/festival/nnpunch.png"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </a>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};
export default Festival;
