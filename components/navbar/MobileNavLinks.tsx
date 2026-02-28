import { SetStateAction, Dispatch } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const MobileNaveLinks = ({ isOpen, setIsOpen }: MobileNavProps) => {
  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen w-screen bg-black text-white transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <IoMdCloseCircle
        className="absolute top-8 left-8 cursor-pointer text-4xl text-white"
        onClick={() => setIsOpen(false)} // Sets it specifically to closed
      />
      <div className="flex h-full w-full flex-col items-center justify-center gap-16 font-lexend text-4xl font-medium">
        <div>Home</div>
        <div>About</div>
        <div>Services</div>
        <div>Home</div>
      </div>
    </div>
  );
};

export default MobileNaveLinks;
