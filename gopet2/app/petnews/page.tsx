"use client";

import { useState, useEffect } from "react";
import { useToggleNav } from "../hooks/useToggleNav";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import NewsItem from "../components/NewsItem";
import Header from "../components/Header";

type Article = {
      title: string;
      description: string;
      url: string;
      urlToImage: string;
      publishedAt: string;
  }

export default function PetNews() {
  const [ articles, setArticles] = useState<Article[]>([]);
  const [ loading, setLoading ] = useState(true);
  const { isNavOpen, toggleNav } = useToggleNav(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const pageLimit = 5;

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/news");
      const response = await res.json();
      setArticles(response.data || []);
      } catch (e) {
        console.error(e);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
  fetchData();
}, []);

    // pagination
    const totalItems = articles?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = articles.slice(startIndex, startIndex + itemsPerPage);

    // 페이지 그룹
    const currentPageGroup = Math.floor((currentPage - 1) / pageLimit);
    const startPage = currentPageGroup * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <>
            <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
            <section>
                <h1 className="flex justify-center text-2xl md:text-3xl p-10 font-bold">🐾 반려동물 News</h1>
                {currentItems.map(article => {
                return <NewsItem key={article.url} article={article}/>
                })}
            </section>
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
                          currentPage === number ? "bg-blue-800 text-white scale-110" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
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

