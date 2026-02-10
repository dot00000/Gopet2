import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

type Article = {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

async function fetchNewsArticles(): Promise<Article[]> {
    try {
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
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function GET() {
    try {
        const data = await fetchNewsArticles();
        const json = JSON.stringify(data, null, 2);
        const blob = await put(
            "newsapi.json",
            json,
            {
                access: "public",
                contentType: "application/json",
                addRandomSuffix: false,
            }
        )
        return NextResponse.json({ 
            success: true, 
            url: blob.url, // public/newsapi.json과 동일
            count: data.length, 
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, data: [] },
            { status: 500 }
        );
    }
}