"use client"
import { useEffect, useState } from "react";
// 파일 경로에 맞춰서 import 하세요. (예: 같은 폴더면 ./KorPetTourApi)
import KorPetTourApi from "../api/KorPetTourApi"; 

export default function Test() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // "KorPetTourApi" 문자열이 아니라 함수를 직접 실행합니다.
        // category 인자가 필요하다면 괄호 안에 넣어주세요.
        const result = await KorPetTourApi("all"); 
        
        console.log("🔥 API 가공 결과:", result);
        setCount(result.length);
      } catch (err) {
        console.error("❌ 테스트 페이지 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333" }}>🐶 반려견 관광 API 테스트</h1>
      <hr />
      {loading ? (
        <p>데이터를 불러오는 중입니다... 잠시만 기다려주세요.</p>
      ) : (
        <div>
          <p style={{ fontSize: "1.2rem" }}>
            성공적으로 <strong>{count}</strong>개의 데이터를 가져왔습니다.
          </p>
          <p>콘솔창(F12)을 열어 <strong>'🔥 API 가공 결과'</strong> 배열을 확인하세요!</p>
        </div>
      )}
    </div>
  );
}