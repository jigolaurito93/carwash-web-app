"use client";

import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileNaveLinks from "./MobileNavLinks";
import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bgOpacity, setBgOpacity] = useState(0.2);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 300; // px till we reach darkest bg
      const minOpacity = 0.1;
      const maxOpacity = 0.7;

      const scrollY = window.scrollY;
      const t = Math.min(scrollY / maxScroll, 1); // 0 → 1
      const opacity = minOpacity + t * (maxOpacity - minOpacity);

      setBgOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Add z-50 and top-0 here
    <nav className="fixed top-0 left-0 z-10 flex h-20 w-full">
      <RxHamburgerMenu
        className="absolute top-8 right-7 cursor-pointer text-4xl text-white lg:hidden"
        onClick={() => setIsOpen(true)}
      />
      <MobileNaveLinks isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className="flex h-full w-full items-center justify-center px-8 text-white lg:justify-between lg:px-12 2xl:px-28"
        style={{ backgroundColor: `rgba(0,0,0,${bgOpacity})` }}
      >
        <div className="flex h-full w-fit items-center justify-center gap-2 px-3 text-3xl font-bold lg:gap-5 xl:pl-10 xl:text-left">
          <Image
            alt="logo"
            src="/images/Untitled.png"
            width={60}
            height={60}
            className="rounded-full bg-black p-1"
          />
          <div className="flex flex-col items-center justify-center">
            <div className="font-bungee">ONYX</div>
            <div className="font-lexend text-[10px] italic">
              PREMIUM CARWASH
            </div>
          </div>
        </div>
        {/* Desktop NavLinks */}
        <div className="hidden h-full justify-center text-lg font-medium lg:flex">
          {navLinks.map((link) => (
            <button key={link.name}>
              <Link
                href={link.href}
                className="flex h-full items-center px-6 font-lexend transition-colors duration-300 ease-in-out hover:bg-white/20"
              >
                {link.name}
              </Link>
            </button>
          ))}
        </div>
        {/* Desktop NavLinks */}
      </div>
    </nav>
  );
};

export default Navbar;
