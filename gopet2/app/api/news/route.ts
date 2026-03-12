import { put, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import axios from "axios";

type Article = {
    title: string;
    description: string;
    link: string;        
    image_url: string;   
    pubDate: string;     
    source_id: string;   
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const CACHE_KEY = "newsapi.json";

async function fetchNewsArticles(): Promise<Article[]> {
    const keywords = ["반려동물", "강아지", "고양이", "펫", "유기동물", "동물병원", "펫푸드", "동물보호"];
    
    const results = await Promise.all(
        keywords.map(keyword =>
            axios.get(`https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_DATA_IO_KEY}&q=${keyword}&language=ko`)
            .then(res => res.data.results || [])  
        )
    );

    const articlesMap = new Map<string, Article>();
    results.flat().forEach((article: Article) => {
        articlesMap.set(article.link, article); 
    });
    
    return Array.from(articlesMap.values());
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
                        cached: true
                    });
                }
            }
        } catch (cacheError) {
            console.log('Cache miss or error:', cacheError);
        }

        const freshData = await fetchNewsArticles();
        
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