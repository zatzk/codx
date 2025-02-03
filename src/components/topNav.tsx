/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { Inter, Silkscreen } from "next/font/google";
import { colorSets } from '~/lib/colors';
import { useColorContext } from "~/lib/colorContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import Image from 'next/image'
import { useRef } from 'react';


const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export function TopNav() {
  const { activeColorSet, setActiveColorSet } = useColorContext();
  const [isAprendaHover, toggleAprendaHover] = useState(false);
  const [isPratiqueHover, togglePratiqueHover] = useState(false);
  const [isProfileHover, toggleProfileHover] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredColor, setHoveredColor] = useState('');
  const submenuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession()

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5
      },
      display: "block"
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.5,
        delay: 0.1
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  const links = [
    { href: "/", color: "text-pink-600", label: "c" },
    { href: "/", color: "text-sky-600", label: "o" },
    { href: "/", color: "text-green-600", label: "d" },
    { href: "/", color: "text-orange-500", label: "x" }
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleMouseEnter = (color: string) => {
    const colorKey = color.split('-')[1];
    if (colorKey && colorSets[colorKey]) {
      setActiveColorSet(colorSets[colorKey]);
    }
    setHoveredColor(color);
  };

  const handleMouseLeave = () => {
    setHoveredColor('');
  };

  return (
    <div className={`fixed z-10 flex justify-center font-sans ${silkscreen.variable} w-full xl:max-w-6xl lg:max-w-4xl md:max-w-2xl md:px-24 rounded-full ${scrolled ? 'bg-gray-500 bg-opacity-40 backdrop-blur-md translate-y-3' : 'transparent'} transition-all duration-300`}>
      <div className="flex items-center justify-between text-xs p-1 sm:w-[640px] w-full md:w-[1440px]">


        <Link href="/" className="flex md:hidden mt-1 w-[60px] items-center justify-center">
          <Image src="/home.png" alt="Logo" width={17} height={17} />
        </Link>

        <div className="hidden md:flex items-center text-xs p-1 ">
          <div className="border-none rounded-full p-3 hover:cursor-pointer">
            <motion.div
              className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}
              onHoverStart={() => toggleAprendaHover(true)}
              onHoverEnd={() => toggleAprendaHover(false)}
            >
              <a className="hover:text-white">aprender</a>
              <motion.div
                className={`absolute ${activeColorSet?.bg} origin-[50%_-30px] px-3 pt-3 mt-2 rounded-md top-[40px]`}
                initial="exit"
                animate={isAprendaHover ? "enter" : "exit"}
                variants={subMenuAnimate}
              >
                <div className="absolute origin-[0_0] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] inset-0" />
                <div className={`flex flex-col`}>
                  <a href="/trilhas" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Trilhas</a>
                  <a href="/cursos" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Cursos</a>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="border-none rounded-full p-3 hover:cursor-pointer">
            <motion.div
              className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}
              onHoverStart={() => togglePratiqueHover(true)}
              onHoverEnd={() => togglePratiqueHover(false)}
            >
              <a className="hover:text-white">praticar</a>
              <motion.div
                className={`absolute ${activeColorSet?.bg} origin-[50%_-30px] px-3 pt-3 mt-2 rounded-md top-[40px]`}
                initial="exit"
                animate={isPratiqueHover ? "enter" : "exit"}
                variants={subMenuAnimate}
              >
                <div className="absolute origin-[0_0] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] inset-0" />
                <div className={`flex flex-col`}>
                  <a href="/desafios" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Desafios</a>
                  <a href="/questoes" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Questões</a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="flex relative items-center font-bold text-lg p-1 md:mr-24">
          <div className="border-none flex items-center rounded-full p-3 hover:cursor-pointer">
            {links.map(link => (
              <a
                key={link.color}
                href={!isMobile ? link.href : undefined} // Disable link navigation on mobile
                className={`mx-1 ${hoveredColor ? (hoveredColor === link.color ? 'text-white' : hoveredColor) : link.color}`}
                onMouseEnter={!isMobile ? () => handleMouseEnter(link.color) : undefined} // Trigger on hover on larger screens
                onClick={isMobile ? () => handleMouseEnter(link.color) : undefined} // Trigger on click on mobile
                onMouseLeave={!isMobile ? handleMouseLeave : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-xs p-1 text-white">
        {session ? (
            <div className="hidden md:flex border-none rounded-full p-3 hover:cursor-pointer mr-6">
              <motion.div
                className={`mx-2 ${activeColorSet?.secondary || 'text-white'}`}
                onHoverStart={() => toggleProfileHover(true)}
                onHoverEnd={() => toggleProfileHover(false)}
              >
                <a className="hover:text-white">Perfil</a>
                <motion.div
                  className={`absolute ${activeColorSet?.bg} origin-[50%_-30px] px-3 pt-3 mt-2 rounded-md top-[40px]`}
                  initial="exit"
                  animate={isProfileHover ? "enter" : "exit"}
                  variants={subMenuAnimate}
                >
                  <div className="absolute origin-[0_0] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] inset-0" />
                  <div className={`flex flex-col`}>
                    <a href="/perfil" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white`}>Ver Perfil</a>
                    <a onClick={() => signOut()} className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white cursor-pointer`}>Sign out</a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <Link href="/signIn" className={`hidden md:flex relative items-center justify-center border border-transparent ${activeColorSet?.hoverBorderButton} hover:cursor-pointer rounded-full p-3 mr-6`}>
              <span className={`flex relative items-center justify-center mx-2 hover:text-white ${activeColorSet?.secondary}`}>
                Entrar
              </span>
            </Link>
          )}

          <div className="relative md:hidden">
            <button
              className={`flex items-center justify-center border border-transparent ${activeColorSet?.hoverBorderButton} hover:cursor-pointer rounded-full p-3 mt-[4px] md:mt-[1px] md:mr-12`}
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu open state on mobile
              onMouseEnter={() => !isMobile && setIsMenuOpen(true)}
              onMouseLeave={() => !isMobile && setIsMenuOpen(false)}
            >
              <span className={`pixelarticons--menu md:mx-3 text-2xl ${activeColorSet?.paragraph}`}></span>
            </button>

            {isMenuOpen && (
              <motion.div
                ref={submenuRef}
                className={`absolute ${activeColorSet?.bg} origin-[50%_-30px] px-3 pt-3 mt-2 w-[150px] rounded-md left-[-100px] md:left-0 top-[50px]`}
                initial="exit"
                animate="enter"
                variants={subMenuAnimate}
              >
                <div className="absolute origin-[0_0] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] inset-0" />
                <div className="flex flex-col">
                  {session ? (
                    <Link onClick={handleLinkClick} href="/perfil" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded border-b-2 text-white md:hidden`}>Ver Perfil</Link>
                  ) : (
                    <Link onClick={handleLinkClick} href="/signIn" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded border-b-2 text-white md:hidden`}>Entrar</Link>
                  )}
                  <Link onClick={handleLinkClick} href="/trilhas" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white md:hidden`}>Trilhas</Link>
                  <Link onClick={handleLinkClick} href="/cursos" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white md:hidden`}>Cursos</Link>
                  <Link onClick={handleLinkClick} href="/questoes" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white md:hidden`}>Questoes</Link>
                  <Link onClick={handleLinkClick} href="/desafios" className={`mb-[10px] z-10 ${activeColorSet?.barHover} p-2 px-2 m-0 rounded text-white md:hidden`}>Desafios</Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}