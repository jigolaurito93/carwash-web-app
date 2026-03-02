import ShopMap from "@/components/GoogleMapShop";
import React from "react";

const Contact = () => {
  return (
    <div className="bg-black/90 py-40 lg:p-60">
      <div>Get In Touch With Us</div>
      <div>
        Have questions about our services? Want to book a wash? We’re here to
        help.
      </div>
      <div>Primary buttons, book now, call now, get directions</div>
      <div>contact info block, address and number, email, hours open</div>
      <div>Contact Form</div>
      <div></div>
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
