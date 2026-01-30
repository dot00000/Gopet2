
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { LuPlus } from "react-icons/lu";

import 'swiper/css';
import 'swiper/css/pagination'
import '../globals.css';

import { Pagination } from "swiper/modules";

const NewsList = () => {

    
    return (
        <>
            <Link href="/petnews" className="flex text-4xl p-8">
                <h1 className="mr-2">News</h1>
                <LuPlus className="mt-1 stroke-[3px]"/>
            </Link>
            <Swiper slidesPerView={3} spaceBetween={30} pagination={{ clickable: true,}} modules={[Pagination]} className="mySwiper">
                <SwiperSlide style={{ height: '300px'}}>Slide 1</SwiperSlide>
                <SwiperSlide style={{ height: '300px'}}>Slide 1</SwiperSlide>
                <SwiperSlide style={{ height: '300px'}}>Slide 1</SwiperSlide>
            </Swiper>
        </>
    )
}

export default NewsList;