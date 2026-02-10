import { put } from '@vercel/blob';

async function upload() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const apiKey = process.env.KCISA_API_KEY;

  if (!token || !apiKey) {
    console.error('환경변수가 없습니다!');
    return;
  }

  console.log('환경변수 로드 완료');
  console.log('API 호출 중...');

  const response = await fetch(
    `https://api.kcisa.kr/openapi/API_TOU_050/request?serviceKey=${apiKey}&type=json`
  );

  console.log('응답 상태:', response.status);
  console.log('Content-Type:', response.headers.get('content-type'));

  // 응답 텍스트로 먼저 확인
  const text = await response.text();
  console.log('응답 길이:', text.length);
  console.log('응답 시작:', text.substring(0, 200));

  // JSON 파싱 시도
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error('JSON 파싱 실패');
    console.log('전체 응답:', text);
    return;
  }

  const items = data.response?.body?.items?.item || [];
  console.log('아이템 개수:', items.length);

  const result = items
    .map((item: any) => {
      if (!item.coordinates || !item.title || !item.tel) return null;
      
      const parts = item.coordinates.split(" ");
      if (parts.length < 2) return null;

      const lat = parseFloat(parts[0].replace(/[^\d.-]/g, ""));
      const lng = parseFloat(parts[1].replace(/[^\d.-]/g, ""));
      if (isNaN(lat) || isNaN(lng)) return null;

      const addressParts = item.address.replace(/\([0-9]+\)/, "").trim().split(" ");
      if (addressParts.length < 2) return null;

      return {
        si: addressParts[0],
        gungu: addressParts[1],
        title: item.title,
        lat, lng,
        address: item.address,
        address2: item.address.replace(/\([0-9]+\)/, "").trim(),
        tel: item.tel,
        url: item.url,
        category2: item.category2,
        description: item.description,
        charge: item.charge,
      };
    })
    .filter(Boolean);

  console.log('필터링 후:', result.length, '개');

  await put('kcisa-data.json', JSON.stringify(result), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true,
    token: token
  });

  console.log('업로드 완료!', result.length, '개');
}

upload();