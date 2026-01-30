"use client";

import "swiper/css";
import { useToggleNav } from "../components/useToggleNav";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Map from "../components/Map";

export default function Shelter() {
  const { isNavOpen, toggleNav } = useToggleNav(false);

  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />

      <div className="relative w-full flex pointer-events-auto">
        <Map />
        {/* SideBar (Map 위에 포개짐) */}
        <div className="absolute top-0 left-0 z-20 w-[500px] overflow-visible">
          <SideBar />
        </div>
      </div>
      <Footer />
    </>
  );
}
