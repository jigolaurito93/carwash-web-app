import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Image
        src="/images/carwash-1.jpg"
        alt="Carwash Image"
        fill
        priority // Preloads the hero image for better performance
        className="object-cover object-top"
      />
      {/* Optional Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/30 flex items-center px-16">
        <h2 className="text-white text-8xl font-bold">Onyx Premium Carwash</h2>
      </div>
    </section>
  );
};

export default Hero;
