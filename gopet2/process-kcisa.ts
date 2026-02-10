import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

async function processAndUpload() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN 없음');
    return;
  }

  console.log('public/kcisa.json 읽는 중...');
  
  const rawData = readFileSync('./public/kcisa.json', 'utf-8');
  const data = JSON.parse(rawData);
  
  // 이미 배열 형태로 처리되어 있음!
  console.log('데이터 개수:', data.length, '개');
  console.log('샘플 데이터:', data[0]);

  console.log('Blob 업로드 중...');
  
  await put('kcisa-data.json', JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true,
    token: token
  });

  console.log('완료!', data.length, '개 업로드됨');
}

processAndUpload();