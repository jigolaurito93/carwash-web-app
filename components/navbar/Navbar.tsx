'use client';

import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileNaveLinks from "./MobileNavLinks";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navTitle = "ONYX";

  return (
    // Add z-50 and top-0 here
    <nav className="fixed top-0 left-0 flex w-full z-10">
      <RxHamburgerMenu className="absolute right-7 cursor-pointer text-4xl lg:hidden top-8 text-white"
        onClick={() => setIsOpen(true)} // Sets it specifically to closed
      />
      <MobileNaveLinks isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex h-full w-full items-center justify-between bg-black/20 text-white lg:px-12 2xl:px-28">
        <h1 className="w-full py-8 text-center text-3xl font-bold xl:pl-10 xl:text-left">
          {navTitle}
        </h1>
        {/* Desktop NavLinks */}
        <div className="hidden w-full justify-center gap-8 text-3xl font-medium lg:flex lg:justify-end xl:gap-14 xl:text-3xl">
          {navLinks.map((link) => (
            <button key={link.name}>
              <Link href={link.href}>{link.name}</Link>
            </button>
          ))}
        </div>
        {/* Desktop NavLinks */}
      </div>


    </nav>
  );
};

export default Navbar;
