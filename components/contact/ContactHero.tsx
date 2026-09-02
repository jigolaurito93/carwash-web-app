"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ContactHeroProps = {
  phone: string | null;
  email: string | null;
};

const ContactHero = ({ phone, email }: ContactHeroProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        alt="carwash image"
        src={isMobile ? "/images/carwash-4.jpg" : "/images/carwash-3.jpg"}
        fill
        priority // Preloads the hero image for better performance
        className="object-cover object-top"
      />

      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="flex w-full flex-col items-center text-center">
          <div className="font-lexend text-5xl font-extrabold tracking-tighter text-yellow-400 drop-shadow-2xl sm:text-7xl md:text-8xl lg:text-9xl">
            Contact Us
          </div>
          {/* <div className="mx-auto my-1 h-[3px] w-28 rounded-full bg-black/60" /> */}
          <div className="mt-2 max-w-125 px-6 font-lexend text-sm font-bold text-white italic sm:text-lg lg:max-w-[700] lg:text-xl">
            Have questions or ready to book your next wash? We&apos;re here to
            help.
          </div>

          {(phone || email) && (
            <div className="mt-16 flex justify-center gap-10 sm:gap-20 lg:mt-24 lg:gap-30">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="w-28 cursor-pointer rounded-sm bg-white px-4 py-2 text-center font-questrial text-black shadow-2xl hover:bg-teal-500 hover:text-white lg:w-44 lg:text-xl"
                >
                  Call Now
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="w-28 cursor-pointer rounded-sm bg-white px-4 py-2 text-center font-questrial text-black shadow-2xl hover:bg-teal-500 hover:text-white lg:w-44 lg:text-xl"
                >
                  Book Now
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactHero;
