import Link from "next/link";
import styles from "./NavBar.module.css";
import Image from "next/image";
const NavBar: React.FC = () => {
  return (
    <nav className="flex p-4 bg-[#e0e4dc]/70 text-center justify-evenly font-bold ">
      <Link href="/hotel" className="flex-1 max-w-[210px]">
        <div className={styles.nav_box}>
          <Image src="/images/navmenu/hotel.png" alt="숙박 아이콘" width={110} height={20} className="border-20"/>
          <h2 className={styles.nav_font}>숙 소</h2>
        </div>
      </Link>
      <Link href="/maps" className="flex-1 max-w-[210px]">
        <div className={styles.nav_box}>
          <Image src="/images/navmenu/food.png" alt="음식 아이콘" width={110} height={20} className="border-15
          "/>
          <h2 className={styles.nav_font}>지 도</h2>
        </div>
      </Link>
      <Link href="/adoption" className="flex-1 max-w-[210px]">
        <div className={styles.nav_box}>
          <Image src="/images/navmenu/adopt.png" alt="체험 아이콘" width={110} height={20} className="border-20
          "/>
          <h2 className={styles.nav_font}>보호소입양</h2>
        </div>
      </Link>
      <Link href="/shelter" className="flex-1 max-w-[210px]">
        <div className={styles.nav_box}>
          <Image src="/images/navmenu/shelter.png" alt="봉사/보호소 아이콘" width={110} height={20} className="border-20
          "/>
          <h2 className={styles.nav_font}>보호소</h2>
        </div>
      </Link>
      <Link href="/petnews" className="flex-1 max-w-[210px]">
        <div className={styles.nav_box}>
          <Image src="/images/navmenu/petnews.png" alt="뉴스 아이콘" width={110} height={20} className="border-20
          "/>
          <h2 className={styles.nav_font}>뉴 스</h2>
        </div>
      </Link>
    </nav>
  );
};

export default NavBar;
