import { head, put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { xml2json } from 'xml-js';

// type Animal = {
//     identify: string;
//     state: string;
//     image: string;
//     weight: string;
//     age: string;
//     begindate: string;
//     enddate: string;
//     sex: string;
//     lat: number;
//     long: number;
//     tel: string;
//     shelter: string;
// }

const ONE_DAY = 24 * 60 * 60 * 1000;
const CACHE_KEY = "animals.json";

async function fetchGgAnimal() {
    const response = await fetch(
        `https://openapi.gg.go.kr/AbdmAnimalProtect?KEY=${process.env.GG_API_KEY}`
    );
    const textData = await response.text();
    const jsonData = JSON.parse(xml2json(textData, { compact: true, spaces: 2 }));
    const items = jsonData.AbdmAnimalProtect?.row ?? [];

    // const result = items.map((item: any) => ({
    //     number: item.ABDM_IDNTFY_NO?._text,
    //     state: item.STATE_NM?._text,
    //     img: item.THUMB_IMAGE_COURS?._text,
    //     kg: item.BDWGH_INFO?._text,
    //     age: item.AGE_INFO?._text,
    //     begindate: item.PBLANC_BEGIN_DE?._text,
    //     enddate: item.PBLANC_END_DE?._text,
    //     sex: item.SEX_NM?._text,
    //     lat: parseFloat(item.REFINE_WGS84_LAT?._text),
    //     lng: parseFloat(item.REFINE_WGS84_LOGT?._text),
    //     tel: item.SHTER_TELNO?._text,
    //     shelter: item.SHTER_NM?._text,
    // }));

    // return result;

    return items;
}

export async function GET() {
    try {
        // 1. 캐시 확인
        try {
            const blobInfo = await head(CACHE_KEY);

            if (blobInfo) {
                const uploadTime = new Date(blobInfo.uploadedAt).getTime();
                const now = Date.now();

                if (now - uploadTime < ONE_DAY) {
                    const blobResponse = await fetch(blobInfo.url);
                    const cachedData = await blobResponse.json();

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

        // 2. 새 데이터 fetch
        const freshData = await fetchGgAnimal();

        // 3. Blob 저장
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
        console.error('[ANIMAL API ERROR]:', err);
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