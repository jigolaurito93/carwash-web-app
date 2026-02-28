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
      <div className="absolute inset-0 flex items-center bg-black/30 px-16">
        <h2 className="text-8xl font-bold text-white">Onyx Premium Carwash</h2>
      </div>
    </section>
  );
};

export default Hero;
