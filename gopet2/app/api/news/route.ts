import { put, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import axios from "axios";

type Article = {
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
};

const ONE_DAY = 24 * 60 * 60 * 1000;
const CACHE_KEY = "newsapi.json";

function isSimilarTitle(a: string, b: string): boolean {
  const keywordsA = a.match(/\d+일|\d+월|[가-힣]{2,}/g) || [];
  const keywordsB = b.match(/\d+일|\d+월|[가-힣]{2,}/g) || [];

  if (keywordsA.length < 3 || keywordsB.length < 3) {
    return a.includes(b) || b.includes(a);
  }

  const matchCount = keywordsA.filter((word) => b.includes(word)).length;
  return matchCount >= 3;
}


async function fetchNewsArticles(): Promise<Article[]> {
  const keywords = ["반려동물", "강아지", "고양이", "펫"];

  const articlesMap = new Map<string, Article>();

  for (const keyword of keywords) {
    try {
      const res = await axios.get(
        `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_DATA_IO_KEY}&q=${keyword}&language=ko`,
      );
      const articles = res.data.results || [];
      articles.forEach((article: Article) => {
        articlesMap.set(article.link, article);
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`키워드 "${keyword}" 요청 실패:`, err);
    }
  }
  const titleList: Array<{ title: string; date: string }> = [];

return Array.from(articlesMap.values()).filter((article) => {
  const title = article.title?.trim();
  const date = article.pubDate?.slice(0, 10);
  if (!title || !date) return false;

  const isDuplicate = titleList.some(
    (existing) => existing.date === date && isSimilarTitle(existing.title, title)
  );
  if (isDuplicate) return false;

  titleList.push({ title, date });
  return true;
});
}

export async function GET() {
  try {
    let cachedData = null;

    try {
      const blobInfo = await head(CACHE_KEY);

      if (blobInfo) {
        const uploadTime = new Date(blobInfo.uploadedAt).getTime();
        const now = Date.now();

        if (now - uploadTime < ONE_DAY) {
          const blobResponse = await fetch(blobInfo.url);
          const blobText = await blobResponse.text();
          cachedData = JSON.parse(blobText);

          return NextResponse.json({
            success: true,
            data: cachedData,
            cached: true,
          });
        }
      }
    } catch (cacheError) {
      console.log("Cache miss or error:", cacheError);
    }

    const freshData = await fetchNewsArticles();

    await put(CACHE_KEY, JSON.stringify(freshData), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({
      success: true,
      data: freshData,
      cached: false,
    });
  } catch (err) {
    console.error("[NEWS API ERROR]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        data: [],
      },
      { status: 500 },
    );
  }
}
