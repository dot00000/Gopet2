"use client";
import AdoptEmblaCarousel from "./components/AdoptEmblaCarousel";
import Festival from "./components/Festival";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NewsList from "./components/NewsList";
import NewsSKeleton from "./components/Skeleton/NewsSkeleton";
import AdoptEmblaSkeleton from "./components/Skeleton/AdoptEmblaSkeleton";
import { useToggleNav } from "./hooks/useToggleNav";
import { Suspense } from "react";
import "./globals.css";

const OPTIONS = { loop: true }
const SLIDE_COUNT = 8
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Home() {
  const {isNavOpen, toggleNav} = useToggleNav(true);
  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav}/>
      <Festival/>
      <Suspense fallback={<NewsSKeleton/>}>
        <NewsList/>
      </Suspense>
      <Suspense fallback={<AdoptEmblaSkeleton/>}>
        <AdoptEmblaCarousel slides={SLIDES} options={OPTIONS}/>
      </Suspense>
      <Footer/>
    </>
  );
}
