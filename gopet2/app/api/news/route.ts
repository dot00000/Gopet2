import path from "path";
import fs from "fs";
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

        const filePath = path.join(process.cwd(), "public", "newsapi.json");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

        return NextResponse.json({ 
            success: true, 
            count: data.length, 
            data 
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, data: [] },
            { status: 500 }
        );
    }
}