const KorPetTourApi = async(contentId) => {
    
    const apiUrl = `https://apis.data.go.kr/B551011/KorPetTourService2/detailIntro2?ServiceKey=${process.env.NEXT_PUBLIC_KOR_PET_TOUR_SERVICE}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&contentTypeId=32`;
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/json",
            },
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const items = data.response?.body?.items?.item || [];
        if (!items.length) return null;
        console.log(data.response.body.totalCount);
        console.log("contentId:", contentId);
        console.log("apiUrl", apiUrl);
        
        
        return items[0];
        
        
        const result = items
        .map((item) => {
            const address = item.addr1;
            const mapx = item.mapx;
            const mapy = item.mapy;
            const image = item.firstimage;
            const thumbnail = item.fistimage2;
            const title = item.title;
            const zipcode = item.zipcode;
            return {
                address, mapx, mapy, image, thumbnail, title, zipcode
            }
        })
        .filter(Boolean);
        console.log(result);
        return result;
    }catch(error){
        console.error(error);
        return [];
    }
}
export default KorPetTourApi;


// numOfRows -> 지도영역 내 filter, 이동할 때마다 fetch, 디바운스 사용하여 이동 없을 경우에만 호출한다.
