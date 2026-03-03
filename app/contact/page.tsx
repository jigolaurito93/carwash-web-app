import ShopMap from "@/components/GoogleMapShop";
import ShopInfoSection2 from "@/components/ShopInfoSection2";

const Contact = () => {
  return (
    <div className="space-y-3 px-6 py-24 font-questrial text-black lg:pt-28">
      <div>
        <div>
          {/* Section 1 */}
          <div className="mx-auto w-full max-w-[500px] rounded-md px-4 py-4 lg:max-w-[580px]">
            <div className="text-center font-lexend text-xl font-bold md:text-yellow-400 lg:text-2xl">
              Get In Touch With Us
            </div>
            <div className="text-center text-sm italic lg:text-base">
              Have questions or ready to book your next wash? We&apos;re here to
              help.
            </div>
            {/* Call to action buttons */}
            <div className="my-2 mt-8 flex justify-center gap-10 text-black lg:mt-12">
              <a
                href="tel:+1234567890"
                className="w-28 cursor-pointer rounded-sm bg-black px-4 py-2 text-center text-white hover:text-black/40"
              >
                Call Now
              </a>

              <a
                href="mailto:info@onyxwash.com"
                className="w-28 cursor-pointer rounded-sm bg-black px-4 py-2 text-center text-white hover:text-black/40"
              >
                Book Now
              </a>
            </div>
            {/* Call to action buttons */}
          </div>
          {/* Section 1 */}

          {/* Section 2 */}
          <ShopInfoSection2 />
          {/* Section 2 */}
        </div>

        {/* Section 3 */}
        <div className="space-y-5 sm:px-16">
          <div className="text-center font-lexend text-xl">
            Find Our Location
          </div>
          <ShopMap />
        </div>
        {/* Section 3 */}
      </div>

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
