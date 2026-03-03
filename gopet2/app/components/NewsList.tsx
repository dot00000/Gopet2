import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
};

const NewsList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/news");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setArticles(result.data);
        }
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
      <section className="max-w-6xl mx-auto px-6 py-4">
        <Link
          href="/petnews"
          className="flex items-center justify-center mx-auto text-3xl pb-5"
          style={{ width: "400px" }}
        >
          <h1 className="font-bold mr-2 py-10">반려동물 뉴스</h1>
          <img
            src="/images/footprint.png"
            alt=""
            style={{ width: "40px", height: "40px" }}
          />
        </Link>
        {loading ? (
          <div>로딩중...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {articles[0] && (
              <div className="lg:col-span-2 group cursor-pointer">
                <a
                  href={articles[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative overflow-hidden rounded-2xl shadow-lg"
                >
                  {/* 이미지 */}
                  <img
                    src={articles[0].urlToImage}
                    alt="thumbnail"
                    className="w-full h-[450px] object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h2 className="text-2xl font-bold tracking-tight leading-snug">
                      {articles[0].title}
                    </h2>
                    <p className="text-sm mb-2 opacity-80">
                      {articles[0].publishedAt.slice(0, 10)}
                    </p>

                    <p className="mt-3 line-clamp-2 opacity-90">
                      {articles[0].description}
                    </p>
                  </div>
                </a>
              </div>
            )}

            {/* 🗞 오른쪽 작은 뉴스 2개 */}
            <div className="flex flex-col gap-6 justify-center">
              {articles.slice(1, 3).map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[400px] h-[210px] flex gap-4 group cursor-pointer rounded-2xl items-center bg-white p-6 shadow-lg hover:shadow-xl transition duration-300"
                  style={{
                    backgroundColor: "white",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    paddingTop: "25px",
                    paddingBottom: "25px",
                  }}
                >
                  {article.urlToImage && (
                    <div className="w-40 h-30 overflow-hidden rounded-xl flex-shrink-0">
                      <img
                        src={article.urlToImage}
                        alt="thumbnail"
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div>
                    <h3
                      className="text-lg font-semibold leading-snug"
                      style={{ width: "180px" }}
                    >
                      {article.title}
                    </h3>
                    <h3 className="text-gray-600 mt-5 line-clamp-3">
                      {article.publishedAt.slice(0, 10)}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default NewsList;
