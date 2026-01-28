'use client';
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const PageUpButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 맨 위로
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'});
    ;}

    return visible ? (
    <button
      onClick={scrollToTop}
      className="
        fixed bottom-8 right-20
        w-12 h-12 rounded-full
        bg-black text-white text-xl
        flex items-center justify-center
        transition-opacity
        hidden sm:flex
      "
      title="맨 위로"
    >
      <FaArrowUp />
    </button>
  ) : null;

}



export default PageUpButton;