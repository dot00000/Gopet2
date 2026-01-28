'use client';

import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import NavBar from "./NavBar";
type HeaderProps = {
  isNavOpen: boolean;
  toggleNav: () => void;
}


const Header: React.FC<HeaderProps> = ( {isNavOpen, toggleNav}) => {
  return (
    <div className="grid grid-rows-1 grid-cols-1 gap-4 m-5">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/picture_images/navmenu/logo.png"
              alt="고펫 로고"
              width={55}
              height={20}
              priority
            />
            <h1 className="ml-5 text-3xl">고 펫</h1>
          </div>
        </Link>
        {/* <div className="flex flex-grow justify-center m-5 items-center" >
            <ListSearch />
        </div> */}
      </div>
      <div className="flex justify-end items-center">
        <button onClick={toggleNav}>
          <FiMenu/>
        </button>
      </div>
      <div className="col-span-2 p-0">
        {isNavOpen && <NavBar />}
      </div>
    </div>
    
  );
};


export default Header;
