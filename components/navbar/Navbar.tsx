import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  return (
    // Add z-50 and top-0 here
    <nav className="fixed top-0 left-0 w-full z-50 flex">
      <div className="flex items-center text-white w-full h-full justify-between bg-black/20 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center border w-full py-8">
          ONYX PREMIUM WASHsw
        </h1>
        <RxHamburgerMenu />
        {/* Desktop NavLinks */}
        <div className="lg:flex gap-14 font-medium text-3xl pr-48 hidden">
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
