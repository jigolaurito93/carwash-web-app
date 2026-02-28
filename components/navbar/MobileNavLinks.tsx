

import { SetStateAction, Dispatch } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface MobileNavProps {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const MobileNaveLinks = ({ isOpen, setIsOpen }: MobileNavProps) => {

    return (
        <div className={`bg-black text-white w-screen h-screen fixed top-0 left-0 z-50 transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <IoMdCloseCircle
                className="text-white text-4xl top-5 left-5 absolute cursor-pointer"
                onClick={() => setIsOpen(false)} // Sets it specifically to closed
            />

            <div className="flex w-full h-full flex-col text-4xl justify-center items-center gap-16 font-medium">
                <div>Home</div>
                <div>About</div>
                <div>Services</div>
                <div>Home</div>
            </div>
        </div>
    );
};

export default MobileNaveLinks;
