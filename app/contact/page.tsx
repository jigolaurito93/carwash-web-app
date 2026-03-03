import ShopMap from "@/components/GoogleMapShop";
import ShopInfoSection from "@/components/ShopInfoSection";
import React from "react";

const Contact = () => {
  return (
    <div className="space-y-3 bg-black px-6 py-28 font-questrial text-white lg:p-60">
      <div className="text-center font-lexend text-xl">
        Get In Touch With Us
      </div>
      <div className="text-center italic">
        Have questions or ready to book your next wash? We’re here to help.
      </div>
      <div className="my-5 mt-10 flex justify-center gap-10 text-black">
        <a
          href="tel:+1234567890"
          className="w-28 cursor-pointer rounded-sm bg-white px-4 py-2 text-center hover:text-black/40"
        >
          Call Now
        </a>

        <a
          href="mailto:info@onyxwash.com"
          className="w-28 cursor-pointer rounded-sm bg-white px-4 py-2 text-center hover:text-black/40"
        >
          Book Now
        </a>
      </div>
      <ShopInfoSection />
      <div>Contact Form</div>
      <div className="text-center font-lexend text-xl">Find Our Location</div>
      <ShopMap />
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
