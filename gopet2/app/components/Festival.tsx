import Image from "next/image";
const Festival = () => {
  return (
    <>
        <div className="relative w-full h-[400px] flex overflow-hidden">
        <h1 className="z-10 flex text-4xl font-bold text-white p-8">Festival</h1>
            <Image
            src="/images/banner5.jpg"
            alt="배경"
            fill // 부모 요소(div)를 꽉 채웁니다
            className="object-cover opacity-90 brightness-20"
            priority
            />
      </div>
    </>
  );
};

export default Festival;
