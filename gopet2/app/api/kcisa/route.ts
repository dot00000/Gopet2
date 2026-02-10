import { head } from '@vercel/blob';

const CACHE_KEY = 'kcisa-data.json';

export async function GET() {
  try {
    // Blob에서 캐시 가져오기
    const blobInfo = await head(CACHE_KEY);
    const blobResponse = await fetch(blobInfo.url);
    const blobText = await blobResponse.text();
    const data = JSON.parse(blobText);
    
    return Response.json({
      success: true,
      data: data,
      cached: true,
      lastUpdated: blobInfo.uploadedAt
    });
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ 
      success: false, 
      error: 'Cache not found',
      data: [] 
    }, { status: 500 });
  }
}