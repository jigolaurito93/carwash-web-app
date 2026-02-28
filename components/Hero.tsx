import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/carwash-1.jpg"
        alt="Carwash Image"
        fill
        priority // Preloads the hero image for better performance
        className="object-cover object-top"
      />
      {/* Optional Overlay to make text readable */}
      <div className="absolute flex h-full w-full flex-col items-center justify-center gap-3 bg-black/40 px-16">
        <div className="rounded-sm border px-12 font-bungee text-6xl font-bold text-white shadow-lg transition-colors duration-300 ease-in-out select-none hover:bg-white/40 hover:text-black sm:text-9xl">
          ONYX
        </div>
        <div className="font-lexend text-lg font-bold text-white italic sm:text-[33px]">
          PREMIUM CARWASH
        </div>
      </div>
    </section>
  );
};

export default Hero;
