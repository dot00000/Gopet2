const AdoptEmblaSkeleton = () => {
  return (
    <>
      {/* 데스크탑: 실제 캐러셀과 동일한 구조 */}
      <div className="hidden md:flex w-full gap-4 items-start animate-pulse">
        
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex gap-[10px] ml-[10px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-none w-[260px] pr-2">
                <div className="flex flex-col rounded-2xl bg-white w-full h-[340px] p-4 shadow-sm border border-gray-100">
                  <div className="w-full h-[180px] rounded-xl bg-gray-200" />
                  <div className="flex flex-col mt-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 배너 카드 */}
        <div className="relative flex-shrink-0 rounded-3xl bg-gray-100 w-[240px] h-[340px] shadow-md" />
      </div>

      
      <div className="flex md:hidden w-full animate-pulse">
        <div className="w-full rounded-3xl bg-gray-100 h-[340px] shadow-md" />
      </div>
    </>
  );
};

export default AdoptEmblaSkeleton;