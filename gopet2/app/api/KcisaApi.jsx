
const KcisaApi = async(categoryFilter) => {
    const apiKey = `https://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${process.env.NEXT_PUBLIC_KCISA_API_KEY}&type=json`;
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