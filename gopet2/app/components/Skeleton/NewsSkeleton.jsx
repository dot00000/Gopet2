const NewsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-pulse">
    {/* 왼쪽 큰 카드 껍데기 */}
    <div className="lg:col-span-2 h-[450px] bg-gray-200 rounded-2xl"></div>
    {/* 오른쪽 작은 카드 2개 껍데기 */}
    <div className="flex flex-col gap-6 justify-center">
      <div className="w-[400px] h-[210px] bg-gray-200 rounded-2xl"></div>
      <div className="w-[400px] h-[210px] bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);

export default NewsSkeleton;