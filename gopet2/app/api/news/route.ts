import { put, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import axios from "axios";

type Article = {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
};

const ONE_DAY = 24 * 60 * 60 * 1000;
const CACHE_KEY = "newsapi.json";

async function fetchNewsArticles(): Promise<Article[]> {
  const keywords = ["반려동물", "강아지", "고양이", "펫"];

  const articlesMap = new Map<string, Article>();

  for (const keyword of keywords) {
    try {
      const res = await axios.get(
        `https://gnews.io/api/v4/search?q=${keyword}&lang=ko&apikey=${process.env.GNEWS_API_KEY}`,
      );
      const articles = res.data.results || [];
      articles.forEach((article: Article) => {
        articlesMap.set(article.url, article);
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`키워드 "${keyword}" 요청 실패:`, err);
    }
  }
  const titleSet = new Set<string>();
  return Array.from(articlesMap.values()).filter((article) => {
    const key = article.title?.trim().toLowerCase();
    if (!key || titleSet.has(key)) return false;
    titleSet.add(key);
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
