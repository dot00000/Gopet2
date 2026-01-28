import { useEffect } from 'react';
import { xml2json } from 'xml-js';
const GgAnimalApi = async() => {
    const gganimal = `https://openapi.gg.go.kr/AbdmAnimalProtect?`
    try {

        const response = await fetch(gganimal);
        const textData = await response.text();

        // xml데이터를 Json으로 변환
        const jsonData = JSON.parse(xml2json(textData, {compact: true, spaces: 2}));
        // 변환된 JSON 데이터에서 리스트 항목 추출
        const extracteditmes = jsonData.schoolinfo?.row;
        setItems(extracteditmes);
        setLoading(false);
    }catch (err) {
        setError('Failed to fetch or parse data');
        setLoading(false);
    }
    useEffect(() => {
        return () => {
            fetchXmlData();
        }
    },[]);
    
    return (
        <>
        </>
    )
}

export default GgAnimalApi;