import { put, head } from "@vercel/blob";
import { NextResponse } from "next/server";

type Article = {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const CACHE_KEY = "newsapi.json";

async function fetchNewsArticles(): Promise<Article[]> {
    const response = await fetch(
        `https://newsapi.org/v2/everything?q=반려동물+OR+강아지&language=ko&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
    );
    const responseData = await response.json();
    
    const articlesMap = new Map<string, Article>();
    responseData.articles.forEach((article: Article) => {
        articlesMap.set(article.url, article);
    });
    const uniqueArticles = Array.from(articlesMap.values());
    return uniqueArticles.slice(0, 3);
}

export async function GET() {
    try {
        // 1. 캐시부터 확인
        let cachedData = null;
        
        try {
            const blobInfo = await head(CACHE_KEY);
            
            if (blobInfo) {
                const uploadTime = new Date(blobInfo.uploadedAt).getTime();
                const now = Date.now();
                
                // 하루 안 지났으면 캐시 사용
                if (now - uploadTime < ONE_DAY) {
                    const blobResponse = await fetch(blobInfo.url);
                    const blobText = await blobResponse.text(); // JSON 문자열로 받기
                    cachedData = JSON.parse(blobText); // 직접 파싱
                    
                    return NextResponse.json({
                        success: true,
                        data: cachedData,
                        cached: true
                    });
                }
            }
        } catch (cacheError) {
            console.log('Cache miss or error:', cacheError);
            // 캐시 없음 → 새로 가져오기
        }

        // 2. 새로운 데이터 가져오기
        const freshData = await fetchNewsArticles();
        
        // 3. Blob에 저장
        await put(CACHE_KEY, JSON.stringify(freshData), {
            access: "public",
            contentType: "application/json",
            addRandomSuffix: false,
            allowOverwrite: true
        });
        
        return NextResponse.json({ 
            success: true, 
            data: freshData,
            cached: false
        });
        
    } catch (err) {
        console.error('[NEWS API ERROR]:', err);
        return NextResponse.json(
            { 
                success: false, 
                error: err instanceof Error ? err.message : 'Unknown error',
                data: [] 
            },
            { status: 500 }
        );
    }
}