import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/carwash-1.jpg"
        alt="Carwash Image"
        fill
        priority // Preloads the hero image for better performance
        className="object-cover object-top"
      />
      {/* Optional Overlay to make text readable */}
      <div className="absolute flex h-full w-full flex-col items-center justify-center gap-2 bg-black/40 px-12">
        <div className="rounded-sm border px-12 font-bungee text-6xl font-bold text-white shadow-lg transition-colors duration-300 ease-in-out select-none hover:bg-white/40 hover:text-black sm:text-9xl">
          ONYX
        </div>
        <div className="font-lexend text-[17px] font-bold text-white italic sm:text-[33px]">
          PREMIUM CARWASH
        </div>
        <div className="text-center font-lexend text-sm text-white sm:text-lg lg:text-xl">
          &rdquo;The Gold Standard of Clean&rdquo;
        </div>
        <Link href={"/contact"}>
          <div className="mt-14 cursor-pointer rounded-full bg-white px-8 py-4 font-lexend text-xs shadow-2xl transition-colors duration-300 ease-in-out hover:bg-black/30 hover:text-white hover:shadow-white md:text-sm">
            Schedule an Appointment
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
