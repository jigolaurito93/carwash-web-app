"use client";

import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileNaveLinks from "./MobileNavLinks";
import { useEffect, useState } from "react";

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
  const navTitle: string = "ONYX";

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
        className="flex h-full w-full items-center justify-center text-white lg:justify-between lg:px-12 2xl:px-28"
        style={{ backgroundColor: `rgba(0,0,0,${bgOpacity})` }}
      >
        <h1 className="flex h-full w-full items-center justify-center text-3xl font-bold xl:pl-10 xl:text-left">
          {navTitle}
        </h1>
        {/* Desktop NavLinks */}
        <div className="hidden h-full justify-center text-2xl font-medium lg:flex">
          {navLinks.map((link) => (
            <button key={link.name}>
              <Link
                href={link.href}
                className="flex h-full items-center px-6 transition-colors duration-300 ease-in-out hover:bg-white/20"
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
