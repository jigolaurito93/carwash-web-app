import Link from "next/link";
import { SetStateAction, Dispatch } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const MobileNaveLinks = ({ isOpen, setIsOpen }: MobileNavProps) => {
  //Function to close the navbar when a route is clicked
  const handleCloseNav = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen w-screen bg-black text-white transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <IoMdCloseCircle
        className="absolute top-8 left-8 cursor-pointer text-4xl text-white"
        onClick={handleCloseNav} // Sets it specifically to closed
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-16 font-lexend text-4xl font-medium">
        <Link href={"/"} onClick={handleCloseNav}>
          Home
        </Link>
        <Link href={"/about"} onClick={handleCloseNav}>
          About
        </Link>
        <Link href={"/services"} onClick={handleCloseNav}>
          Services
        </Link>
        <Link href={"/"} onClick={handleCloseNav}>
          Home
        </Link>
      </div>
    </div>
  );
};

export default MobileNaveLinks;
