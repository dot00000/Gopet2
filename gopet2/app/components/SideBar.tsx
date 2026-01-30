"use client";

import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import "swiper/css";
import Header from "./Header";
export default function SideBar() {
  const swiperRef = useRef<Swiper | null>(null);
  const [open, setOpen] = useState(false);

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

//   return (
//     <>
//     <div className="swiper relative z-20" style={{ height: '800px'}}>
//       <div className="swiper-wrapper">
//         <div className="swiper-slide menu">MENU</div>
        
//         <div className="swiper-slide content">
//           <div
//             className={`menu-button ${open ? "cross" : ""}`}
//             onClick={toggleMenu}
//           >
//             <span className="bar" />
//             <span className="bar" />
//             <span className="bar" />
//           </div>
//           <p>Map</p>
//         </div>
//       </div>
//     </div>
//     </>
//   );
return (
  <>
    <div className="swiper relative" style={{ height: '800px'}}>
      <div className="swiper-wrapper">
        <div className="swiper-slide menu">MENU</div>
        
        <div className="swiper-slide">
            {/* 버튼 영역 - 메뉴 width만큼 여백 */}
            <div className="flex flex-row">
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
  </>
);
}
