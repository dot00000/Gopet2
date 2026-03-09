import { put, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import axios from "axios";

type Article = {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const CACHE_KEY = "newsapi.json";

async function fetchNewsArticles(): Promise<Article[]> {
    const keywords = ["반려동물", "강아지", "고양이", "펫"];
    
    const results = await Promise.all(
        keywords.map(keyword =>
            axios.get(`https://newsapi.org/v2/everything?q=${keyword}&language=ko&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`)
            .then(res => res.data.articles || [])
        )
    );

    const articlesMap = new Map<string, Article>();
    results.flat().forEach((article: Article) => {
        articlesMap.set(article.url, article);
    });
    
    return Array.from(articlesMap.values());
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