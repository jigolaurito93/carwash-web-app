import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import ShopMap from "@/components/GoogleMapShop";
import ShopInfoSection from "@/components/ShopInfoSection";
import { supabase } from "@/lib/supabase";

// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px


const Contact = async () => {
  const { data: shopAddress, error } = await supabase
    .from("shop_info")
    .select("address1, address2, city, state, zip, phone, email, latitude, longitude")
    .single();

  if (error) {
    console.error(error);
  }

  return (
    <div>
      {/* Section 1 - Hero */}
      <ContactHero />
      {/* Section 1 - Hero */}

      <div>
        {/* Section 2 */}
        <ShopInfoSection variant="light" />
        {/* Section 2 */}
      </div>

      {/* Section 3 */}
      <div className="flex flex-col justify-center space-y-5 bg-black px-7 py-12 md:px-14 md:py-20">
        <div className="mb-8 text-center font-lexend text-3xl font-bold tracking-tight text-white sm:text-4xl md:mb-14 lg:text-5xl">
          Find Our Location
        </div>
        {/* Google Map */}
        <ShopMap shopAddress={shopAddress}/>
        {/* Google Map */}
      </div>
      {/* Section 3 */}

      {/* FAQ */}
      <FAQ />
      {/* FAQ */}

      {/* Form */}
      <div className="mx-auto flex max-w-125 flex-col items-center gap-4 p-10 font-questrial md:max-w-150 lg:max-w-175">
        <div className="font-lexend text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Have a Question?
        </div>
        <div className="text-center">
          Fill out the form below and our team will get back to you as soon as
          possible. We&apos;re happy to help with bookings, services, or
          anything else you need.
        </div>
        <div></div>
        <ContactForm />
      </div>
      {/* Form */}
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
