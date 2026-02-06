import fs from "fs";
import path from "path";
import KcisaApi from "../KcisaApi";

const Kcisa = async (categoryFilter: any) => {
  const apiKey = `https://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${process.env.KCISA_API_KEY}&type=json`;
  try {

    const response = await fetch(apiKey, {
      headers: { Accept: "application/json" },
    });
  
    const data = await response.json();
    const items = data.response?.body?.items?.item || [];
  
    const result = items
      .filter((item: any) => {
        if (categoryFilter && item.category2 !== categoryFilter) return false;
        return true;
      })
      .map((item: any) => {
        const title = item.title;
            const coord = item.coordinates;
            if (typeof coord !== "string") {
              return null;
            }
            if (typeof title !== "string") {
              return null;
            }
            const tel = item.tel;
            if(typeof tel !== "string"){
              return null;
            }
            // 공백으로 나눠서 파싱
            const parts = coord.split(" ");
            if (parts.length < 2) {
              return null;
            }
            // N/E 제거하고 숫자만 추출
            const lat = parseFloat(parts[0].replace(/[^\d.-]/g, ""));
            const lng = parseFloat(parts[1].replace(/[^\d.-]/g, ""));
  
            // 우편번호만 분리하기 
            const address2 = item.address.replace(/\([0-9]+\)/, "").trim();
            const addressParts = address2.split(" ");
            const si = addressParts[0];
            const gungu = addressParts[1];
  
            if (addressParts.length < 2) {
              return null;
            }
            
            if (isNaN(lat) || isNaN(lng)) return null;
            
            return {
              si,
              gungu,
              title: item.title,
              lat,
              lng,
              address: item.address,
              address2: address2,
              tel: item.tel,
              url: item.url,
              category2: item.category2,
              description: item.description,
              charge: item.charge,
            };
      })
      .filter(Boolean);
      return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export default Kcisa;

let cache: any[] = [];
let lastUpdated = 0;
const ONE_DAY = 24 * 60 * 60 * 1000; // 24시간

export async function GET() {
  try {
    const data = await KcisaApi();

    // JSON 파일로 저장
    const filePath = path.join(process.cwd(), "public", "kcisa.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    console.log("kcisa.json 내용 샘플:", data.slice(0, 5));

    return new Response(
      JSON.stringify({ success: true, count: data.length, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, data: [] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



// vercel에 배포시 corns사용 하기 위한 코드
//   export async function GET() {
//   try {
//     // 캐시가 있고, 하루 안 지났으면 바로 반환
//     if (cache && Date.now() - lastUpdated < ONE_DAY) {
//       return Response.json(cache);
//     }

//     // 새로 fetch
//     const data = await KcisaApi();

//     // 캐시 저장
//     cache = data;
//     lastUpdated = Date.now();

//     return Response.json(data);
//   } catch (err) {
//     console.error(err);
//     return Response.json({ success: false }, { status: 500 });
//   }
// }
