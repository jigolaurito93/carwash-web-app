"use client";

import ShopMap from "@/components/GoogleMapShop";
import ShopInfoSection2 from "@/components/ShopInfoSection2";
import Image from "next/image";
import { useEffect, useState } from "react";

// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px

const Contact = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Section 1 - Hero */}
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
            <div className="mt-2 max-w-[500px] px-6 font-lexend text-sm font-bold text-white italic sm:text-lg lg:max-w-[700] lg:text-xl">
              Have questions or ready to book your next wash? We&apos;re here to
              help.
            </div>

            {/* Call to action buttons */}
            <div className="mt-16 flex justify-center gap-10 sm:gap-20 lg:mt-24 lg:gap-30">
              <a
                href="tel:+1234567890"
                className="w-28 cursor-pointer rounded-sm bg-white px-4 py-2 text-center font-questrial text-black shadow-2xl hover:bg-teal-500 hover:text-white lg:w-44 lg:text-xl"
              >
                Call Now
              </a>

              <a
                href="mailto:info@onyxwash.com"
                className="w-28 cursor-pointer rounded-sm bg-white px-4 py-2 text-center font-questrial text-black shadow-2xl hover:bg-teal-500 hover:text-white lg:w-44 lg:text-xl"
              >
                Book Now
              </a>
            </div>
            {/* Call to action buttons */}
          </div>
        </div>
      </div>
      {/* Section 1 - Hero */}

      <div>
        {/* Section 2 */}
        <ShopInfoSection2 />
        {/* Section 2 */}
      </div>

      {/* Section 3 */}
      <div className="flex flex-col justify-center space-y-5 bg-black px-7 py-12 md:px-14 md:py-20">
        <div className="mb-8 text-center font-lexend text-xl text-white md:mb-14 md:text-2xl">
          Find Our Location
        </div>

        <ShopMap />
      </div>
      {/* Section 3 */}

      <div>Contact Form</div>
    </div>
  );
};

export default Contact;

// •	Sticky “Call Now” button on mobile
// •	Soft shadow cards
// •	Large tap targets
//      Primary Button:
// 	•	📅 Book Now
// 	•	📞 Call Now
// 	•	📍 Get Directions
