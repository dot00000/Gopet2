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

async function fetchNewsArticles(): Promise<Article[]> {
  const keywords = ["반려동물", "강아지", "고양이", "펫"];

  const articlesMap = new Map<string, Article>();

  for (const keyword of keywords) {
    try {
      const res = await axios.get(
        `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_DATA_IO_KEY}&q=${keyword}&language=ko`
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
    let cacheUrl: string | null = null;

    try {
      const blobInfo = await head(CACHE_KEY);

      if (blobInfo) {
        const uploadTime = new Date(blobInfo.uploadedAt).getTime();
        const now = Date.now();
        cacheUrl = blobInfo.url;

        // 캐시가 유효하면 그대로 반환
        if (now - uploadTime < ONE_DAY) {
          const blobResponse = await fetch(blobInfo.url);
          const blobText = await blobResponse.text();
          const cachedData = JSON.parse(blobText);

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

    // 기존 캐시 불러오기
    let existingData: Article[] = [];
    if (cacheUrl) {
      try {
        const blobResponse = await fetch(cacheUrl);
        const blobText = await blobResponse.text();
        existingData = JSON.parse(blobText);
      } catch (e) {
        console.log("기존 캐시 파싱 실패:", e);
      }
    }

    // 새 데이터가 없으면 기존 캐시 그대로 반환
    if (freshData.length === 0) {
      return NextResponse.json({
        success: true,
        data: existingData,
        cached: true,
        fallback: true,
      });
    }

    // 새 데이터 + 기존 데이터 합치기 (link 기준 중복 제거)
    const merged = [...freshData, ...existingData];
    const deduped = Array.from(
      new Map(merged.map((a) => [a.link, a])).values()
    );

    const sorted = deduped
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 20);

    await put(CACHE_KEY, JSON.stringify(sorted), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({
      success: true,
      data: sorted,
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
