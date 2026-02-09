import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import axios from "axios";

type Article = {
      title: string;
      description: string;
      url: string;
      urlToImage: string;
}

const NewsList = () => {
  const [ articles, setArticles ] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/news");
          const data = await response.json();
          setArticles(data.slice(0, 3));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
    fetchData();
  }, []);
    
    return (
    <>
      <Link href="/petnews" className="flex text-4xl p-8 mt-5" style={{ width: "250px" }}>
        <h1 className="flex mr-2">News</h1>
        <LuPlus className="mt-3 text-2xl stroke-[4px]" />
      </Link>
      <section className="flex justify-evenly items-center">
        {loading ? (
          <div>로딩중...</div>
        ) : (
          articles.map((article, index) => (
            <div
              key={index}
              className="rounded-2xl flex mb-10"
              style={{ height: "270px", width: "500px", backgroundColor: "#f3f4f6" }}
            >
              {article.urlToImage && (
                <div className="flex justify-center items-center ml-5 flex-shrink-0">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <img
                      style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                      src={article.urlToImage}
                      alt="thumbnail"
                    />
                  </a>
                </div>
              )}
              <div className="ml-5 mr-5 flex-1">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold block mb-2 mt-8"
                >
                  {article.title}
                </a>
                <p className="text-sm text-gray-600 line-clamp-7">{article.description}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
};

export default NewsList;