const KorPetTourApi = async(category) => {
    const apiKey = `http://apis.data.go.kr/B551011/KorPetTourService/areaBasedList?ServiceKey=${process.env.NEXT_PUBLIC_KOR_PET_TOUR_SERVICE}&MobileOS=ETC&MobileApp=AppTest&_type=json`
    try {
        const response = await fetch(apiKey, {
            headers: {
                Accept: "application/json",
            },
        })
        const data = await response.json();
        const items = data.response?.body?.items?.item || [];
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
