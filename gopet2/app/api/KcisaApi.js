
const KcisaApi = async(categoryFilter) => {
    const apiKey = `https://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${process.env.KCISA_API_KEY}&type=json`;
    try {
      const response = await fetch(apiKey, {
        headers: {
          Accept: "application/json", // JSON 요청
        },
      });
      const data = await response.json();
      console.log(data);
      
      const items = data.response?.body?.items?.item || [];
      const result = items
        .filter((item) => {
          if (categoryFilter && item.category2 !== categoryFilter) return false;
          return true;
          })
        .map((item) => {
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


export default KcisaApi;

// import fs from "fs";
// import path from "path";

// const KcisaApi = async (categoryFilter) => {
//   const apiKey = `https://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${process.env.NEXT_PUBLIC_KCISA_API_KEY}&type=json`;

//   const response = await fetch(apiKey, {
//     headers: { Accept: "application/json" },
//   });

//   const data = await response.json();
//   const items = data.response?.body?.items?.item || [];

//   const result = items
//     .filter(item => !categoryFilter || item.category2 === categoryFilter)
//     .map(item => {
//       if (
//         typeof item.coordinates !== "string" ||
//         typeof item.title !== "string" ||
//         typeof item.tel !== "string"
//       ) return null;

//       const parts = item.coordinates.split(" ");
//       if (parts.length < 2) return null;

//       const lat = parseFloat(parts[0].replace(/[^\d.-]/g, ""));
//       const lng = parseFloat(parts[1].replace(/[^\d.-]/g, ""));

//       if (isNaN(lat) || isNaN(lng)) return null;

//       const address2 = item.address.replace(/\([0-9]+\)/, "").trim();
//       const addressParts = address2.split(" ");
//       if (addressParts.length < 2) return null;

//       return {
//         si: addressParts[0],
//         gungu: addressParts[1],
//         title: item.title,
//         lat,
//         lng,
//         address: item.address,
//         address2,
//         tel: item.tel,
//         url: item.url,
//         category2: item.category2,
//         description: item.description,
//         charge: item.charge,
//       };
//     })
//     .filter(Boolean);

//   return result;
// };

// export default async function handler(req, res) {
//   try {
//     const data = await KcisaApi();

//     const filePath = path.join(process.cwd(), "public", "kcisa.json");
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

//     res.status(200).json({ success: true, count: data.length });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// }
