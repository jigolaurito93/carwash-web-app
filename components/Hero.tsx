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
      <div className="absolute flex h-full w-full flex-col items-center justify-center gap-3 bg-black/30 px-16 md:items-start">
        <div className="rounded-sm bg-black px-10 py-2 text-8xl font-bold text-white shadow-lg sm:text-9xl md:text-[170px]">
          ONYX
        </div>
        <div className="flex gap-3 px-5 py-2 text-4xl font-bold text-white md:text-[80px]">
          <div className="">Premium</div>
          <div className="">Carwash</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
