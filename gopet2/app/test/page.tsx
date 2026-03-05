"use client"
import { useEffect, useState } from "react";

export default function Test() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const res = await fetch('/api/animals');
        const data = await res.json();

        console.log(data);
        
        setItems(data.items);
        setCount(data.items.length);
        setLoading(false);
    };
    fetchData();
}, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333" }}>반려견 관광 API 테스트</h1>
      <hr />
      {loading ? (
        <p>데이터를 불러오는 중입니다... 잠시만 기다려주세요.</p>
      ) : (
        <div>
          <p style={{ fontSize: "1.2rem" }}>
            성공적으로 <strong>{count}</strong>개의 데이터를 가져왔습니다.
          </p>
          
        </div>
      )}
    </div>
  );
}