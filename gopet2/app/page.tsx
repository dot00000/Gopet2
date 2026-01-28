import Header from "./components/Header";
import HotelShelter from "./components/HotelShelter";
import { useToggleNav } from "./components/useToggleNav";

const OPTIONS = { loop: true }
const SLIDE_COUNT = 8
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Home() {
  const {isNavOpen, toggleNav} = useToggleNav(true);
  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav}/>
      <HotelShelter/>
      <AdoptEmblaCarousel slides={SLIDES} options={OPTIONS}/>
    </>
  );
}
