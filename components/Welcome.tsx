import Image from "next/image";
import Link from "next/link";

const Welcome = () => {
  return (
    <div className="flex min-h-screen flex-col items-stretch gap-6 bg-black/90 px-8 py-20 text-white sm:px-40 md:flex-row md:gap-0 md:px-0 md:py-0 lg:p-0 xl:h-screen">
      <div className="hidden min-h-full md:flex md:w-1/2">
        <Image
          alt="Photo of car"
          src={"/images/carwash-2.jpg"}
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-h-full flex-col gap-5 md:w-1/2 md:justify-center md:px-10 lg:px-18 2xl:px-32">
        <div className="flex flex-col text-center text-white lg:mb-7">
          <div className="font-bungee text-3xl font-bold lg:text-4xl xl:text-5xl 2xl:text-6xl">
            The Full Onyx Experience
          </div>
          <div className="font-bungee 2xl:text-2xl">
            &rdquo;More Than Just a Wash. It&apos;s a Restoration of
            Pride.&rdquo;
          </div>
        </div>
        <div className="font-lexend text-sm">
          Discover why Onyx is the city&apos;s premier destination for 100%
          hand-car wash excellence. We don&apos;t just clean vehicles; we curate
          an experience designed around your lifestyle and your car&apos;s
          longevity.
        </div>
        <div className="mt-6 font-bungee text-2xl font-bold lg:text-3xl">
          Uncompromising Care for Your Vehicle
        </div>
        <div className="font-lexend text-sm">
          Our signature process utilizes the finest equipment and ultra-premium,
          soft-touch materials—ensuring a showroom shine without the harsh
          friction of automated systems.
        </div>
        <div className="font-lexend text-sm">
          From high-gloss finishes to meticulous wheel detailing, our
          specialists treat every curve of your vehicle with the precision it
          deserves.
        </div>
        <div className="mx-auto mt-8 w-fit cursor-pointer rounded-md bg-black px-7 py-3 text-center font-lexend text-sm shadow-lg transition-colors duration-300 hover:bg-black/50 lg:mt-14">
          <Link className="" href={"/about"}>
            More About Onyx
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
