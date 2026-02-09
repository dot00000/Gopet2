import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Keyboard, Scrollbar, Pagination, Autoplay } from 'swiper/modules';

const Festival = () => {


  return (
    <>
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90 brightness-50"
          style={{ backgroundImage: `url(/images/banner5.jpg)` , height: "450px"}}
        />
        
        <div className="relative z-10">
          <h1 className="flex text-4xl font-bold text-white p-8">Festival</h1>
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
              }
            }}
            scrollbar={false}
            navigation={false}
            pagination={{ clickable: true }}
            modules={[Keyboard, Scrollbar, Pagination, Autoplay]}
            className="mySwiper"
            style={{ width: "95%", height: "320px"}}
          >
            <SwiperSlide>
              <a href="https://ilovepets.co.kr/?main=0">
                <img className="rounded-2xl ml-10 mr-10" style={{ width: "90%", height: "280px" }} src="/images/festival/petandmore.png" alt="" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="https://www.pet-show.co.kr/#__890105__item1">
                <img className="rounded-2xl ml-10" style={{ width: "90%", height: "280px"}} src="/images/festival/petshow.jpg" alt="" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="https://www.mypetfair.co.kr/">
                <img className="rounded-2xl ml-10" style={{ width: "90%", height: "280px"}} src="/images/festival/songdo.jpg" alt="" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="https://cat-show.co.kr/">
                <img className="rounded-2xl ml-10" style={{ width: "90%", height: "280px"}} src="/images/festival/nnpunch.png" alt="" />
              </a>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  )
};
export default Festival;
