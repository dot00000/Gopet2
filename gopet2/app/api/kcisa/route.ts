
let cache: any = null;
let lastUpdated = 0;
const ONE_DAY = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    // 캐시가 있고 하루 안 지났으면 반환
    if (cache && Date.now() - lastUpdated < ONE_DAY) {
      return Response.json({ 
        success: true, 
        count: cache.length, 
        data: cache 
      });
    }

    // 새로 API 호출
    const apiKey = `https://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${process.env.KCISA_API_KEY}&type=json`;
    
    const response = await fetch(apiKey, {
      headers: { Accept: "application/json" },
    });

    const data = await response.json();
    const items = data.response?.body?.items?.item || [];

    const result = items
      .map((item: any) => {
        const title = item.title;
        const coord = item.coordinates;
        if (typeof coord !== "string") return null;
        if (typeof title !== "string") return null;
        
        const tel = item.tel;
        if (typeof tel !== "string") return null;

        const parts = coord.split(" ");
        if (parts.length < 2) return null;

        const lat = parseFloat(parts[0].replace(/[^\d.-]/g, ""));
        const lng = parseFloat(parts[1].replace(/[^\d.-]/g, ""));

        const address2 = item.address.replace(/\([0-9]+\)/, "").trim();
        const addressParts = address2.split(" ");
        const si = addressParts[0];
        const gungu = addressParts[1];

        if (addressParts.length < 2) return null;
        if (isNaN(lat) || isNaN(lng)) return null;

        return {
          si, gungu, title: item.title, lat, lng,
          address: item.address, address2, tel: item.tel,
          url: item.url, category2: item.category2,
          description: item.description, charge: item.charge,
        };
      })
      .filter(Boolean);

    // 캐시 저장
    cache = result;
    lastUpdated = Date.now();

    return Response.json({ 
      success: true, 
      count: result.length, 
      data: result 
    });
  } catch (err) {
    console.error(err);
    return Response.json({ 
      success: false, 
      data: [] 
    }, { status: 500 });
  }
}