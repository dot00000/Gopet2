// "use client"
// import { useEffect, useState } from 'react';
// import { xml2json } from 'xml-js';

// const GgAnimalApi = () => {  // async 제거
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             const gganimal = `https://openapi.gg.go.kr/AbdmAnimalProtect?KEY=${process.env.NEXT_PUBLIC_GG_API_KEY}`;
//             try {
//                 const response = await fetch(gganimal);
//                 const textData = await response.text();
//                 const jsonData = JSON.parse(xml2json(textData, { compact: true, spaces: 2 }));
//                 const extractedItems = jsonData.AbdmAnimalProtect?.row;

//                 const items = jsonData.response?.body?.items?.item || [];
//                 const result = items.map((item) => {
//                     const identify = item.PBLANC_IDNTFY_NO;
//                     const state = item.STATE_NM;
//                     const image = item.IMAGE_COURS;
//                     const weight = item.BDWGH_INFO;
//                     const age = item.AGE_INFO;
//                     const begindate = item.PBLANC_BEGIN_DE;
//                     const enddate = item.PBLANC_END_DE;
//                     const sex = item.SEX_NM;
//                     const lat = item.REFINE_WGS84_LAT;
//                     const lng = item.REFINE_WGS84_LOGT;
//                     const tel = item.SHTER_TELNO;
//                     const shelter = item.SHTER_NM;

//                     return {
//                         identify, state, image, weight, age, begindate, enddate, sex, lat, lng, tel, shelter
//                     }
//                 })
                
//                 setItems(extractedItems);
//                 setLoading(false);
//                 console.log(result);
//                 return result;
//             } catch (error) {
//                 console.error(error);
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

// }

// export default GgAnimalApi;