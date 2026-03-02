import Link from "next/link";
import Image from "next/image";
const NavBar: React.FC = () => {
  return (
    <nav className="sticky top-4 z-[100] mx-auto flex w-[95%] max-w-[1200px] items-center justify-evenly rounded-full bg-white/60 p-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/80 border border-white/40">
  {[
    { href: "/hotel", src: "/images/navmenu/hotel.png", label: "숙 소" },
    { href: "/maps", src: "/images/navmenu/food.png", label: "지 도" },
    { href: "/adoption", src: "/images/navmenu/adopt.png", label: "보호소입양" },
    { href: "/shelter", src: "/images/navmenu/shelter.png", label: "보호소" },
    { href: "/petnews", src: "/images/navmenu/petnews.png", label: "뉴 스" },
  ].map((item) => (
    <Link 
      key={item.href} 
      href={item.href} 
      className="group flex flex-1 flex-col items-center justify-center py-2 transition-all duration-300 hover:-translate-y-1"
    >
      {/* 아이콘 배경 원형 효과 */}
      <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-white/40 shadow-sm transition-all duration-300 group-hover:bg-[#477b6a] group-hover:shadow-md">
        <Image 
          src={item.src} 
          alt={item.label} 
          width={50} 
          height={50} 
          className="object-contain transition-all duration-300"
        />
      </div>
      
      {/* 텍스트 스타일링 */}
      <span className="mt-2 text-md font-bold text-gray-700 transition-colors duration-300 group-hover:text-[#477b6a]">
        {item.label}
      </span>
      
      {/* 하단 강조 선 애니메이션 */}
      <div className="mt-1 h-1 w-0 rounded-full bg-[#477b6a] transition-all duration-300 group-hover:w-8" />
    </Link>
  ))}
</nav>
  );
};

export default NavBar;
