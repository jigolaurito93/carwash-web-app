"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PiTargetBold } from "react-icons/pi";
import { FaHandPaper } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";

const About = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <div className="relative h-screen w-full overflow-hidden">
        <Image
          alt="carwash image"
          src={isMobile ? "/images/carwash-6.jpg" : "/images/carwash-7.jpg"}
          fill
          priority // Preloads the hero image for better performance
          className="object-cover object-top"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div className="font-lexend text-6xl font-extrabold tracking-tighter text-yellow-400 drop-shadow-2xl sm:text-7xl lg:text-9xl">
            About Onyx
          </div>
          {/* <div className="mx-auto my-1 h-[3px] w-28 rounded-full bg-black/60" /> */}
          <div className="mt-2 max-w-125 px-6 font-lexend text-xs font-bold text-white italic sm:text-lg lg:max-w-[700] lg:text-xl">
            Premium hand car washing focused on quality, protection, and
            attention to detail.
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="flex flex-col justify-center bg-black/90 px-9 py-10 text-white md:px-24 md:py-20 lg:min-h-screen lg:px-36">
        <div className="text-center font-lexend text-5xl font-bold lg:text-6xl">
          Owner Story
        </div>
        <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-5 font-questrial tracking-wide md:text-2xl lg:mt-16 lg:max-w-220 lg:text-2xl lg:tracking-widest">
          <div>
            Hi, my name is{" "}
            <span className="text-2xl font-bold text-yellow-400 lg:text-4xl">
              Marcus Reynolds
            </span>
            , founder of Onyx Hand Premium Wash. For us, it&apos;s not just
            about washing cars — it&apos;s about providing a service you can
            trust every time you pull in.
          </div>
          <div>
            I started Onyx Hand Premium Wash because I saw how many vehicles
            were being rushed through automated car washes that left scratches,
            swirl marks, and missed details. As someone who takes pride in a
            clean vehicle, I believed there should be a better option.
            That&apos;s why I built Onyx Hand Premium Wash around one simple
            idea: every car deserves careful, premium treatment.
          </div>
          <div>
            Instead of conveyor belts and spinning brushes, every vehicle is
            washed by hand using safe techniques, professional-grade products,
            and soft microfiber materials that protect your paint while
            delivering a deep, spotless clean.
          </div>
        </div>
      </div>
      {/* Story */}

      {/* Mission */}
      <div className="px-9 py-10 md:px-24 md:py-20 lg:px-36">
        <div className="flex flex-col items-center justify-center gap-4 text-center font-lexend text-5xl font-bold md:flex-row lg:text-6xl">
          <div>Our Mission</div>
          <PiTargetBold className="text-yellow-400" size={80} />
        </div>
        <div className="mx-auto mt-8 text-center font-questrial md:text-2xl lg:mt-16 lg:max-w-220 lg:text-3xl">
          Our mission is to deliver a premium hand wash experience that protects
          your vehicle while providing unmatched attention to detail. We focus
          on quality, consistency, and customer satisfaction every time.
        </div>
      </div>
      {/* Mission */}

      {/* Why choose us */}
      <div className="space-y-10 bg-black/90 px-9 py-10 text-white md:px-24 md:py-20 lg:px-12 2xl:px-36">
        <div className="flex flex-col items-center justify-center gap-4 text-center font-lexend text-5xl font-bold md:flex-row lg:text-6xl">
          <div className="tracking-tighter uppercase">Why Choose Us</div>
        </div>

        <div className="mx-auto mt-8 grid grid-cols-1 space-y-12 text-center font-questrial md:mt-16 md:grid-cols-2 md:space-y-8 md:space-x-8 md:text-2xl lg:grid-cols-4 lg:space-x-4 xl:mt-20 2xl:space-x-16">
          {/* 1. Hand Washed Only */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 md:h-14 md:w-14 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
              <FaHandPaper className="h-1/2 w-1/2 text-black" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-yellow-400 uppercase lg:text-2xl">
              Hand Washed Only
            </div>
            <div className="max-w-xl text-xl lg:text-lg 2xl:text-xl">
              Every vehicle is washed by hand to prevent scratches and ensure a
              deeper clean.
            </div>
          </div>

          {/* 2. Attention to Detail */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 md:h-14 md:w-14 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
              <FaMagnifyingGlass className="h-1/2 w-1/2 text-black" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-yellow-400 uppercase lg:text-2xl">
              Attention to Detail
            </div>
            <div className="max-w-xl text-xl lg:text-lg 2xl:text-xl">
              We clean areas many automated washes miss — wheels, trim, and
              finishing touches.
            </div>
          </div>

          {/* 3. Paint-Safe Products */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 md:h-14 md:w-14 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
              <FaShieldAlt className="h-1/2 w-1/2 text-black" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-yellow-400 uppercase lg:text-2xl">
              Paint-Safe Products
            </div>
            <div className="max-w-xl text-xl lg:text-lg 2xl:text-xl">
              We use high-quality soaps and microfiber materials designed to
              protect your vehicle&apos;s finish.
            </div>
          </div>

          {/* 4. Customer First Service */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 md:h-14 md:w-14 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
              <FaHandshake className="h-1/2 w-1/2 text-black" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-yellow-400 uppercase lg:text-2xl">
              Customer First Service
            </div>
            <div className="max-w-xl text-xl lg:text-lg 2xl:text-xl">
              Your satisfaction is our priority, and we take pride in every
              vehicle we wash.
            </div>
          </div>
        </div>
      </div>
      {/* Why choose us */}
    </div>
  );
};

export default About;
