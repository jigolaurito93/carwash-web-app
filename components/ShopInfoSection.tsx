import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ShopInfoSection = () => {
  return (
    <div className="bg-black/90 px-3 py-7 font-lexend text-white md:py-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-8 sm:max-w-md sm:flex-row md:max-w-2xl md:gap-28 lg:gap-36">
        {/* Operating Hours */}
        <div className="space-y-4">
          <div className="text-xl md:text-2xl">Operating Hours</div>

          <ul className="w-full max-w-52 space-y-1 font-questrial text-sm sm:max-w-72 md:text-lg">
            <li className="flex justify-between">
              <span>Mon - Fri:</span> <span>8:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday:</span> <span>9:00 AM - 5:00 PM</span>
            </li>
            <li className="flex justify-between text-blue-400">
              <span>Sunday:</span> <span>Closed</span>
            </li>
          </ul>
        </div>
        {/* Operating Hours */}

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="text-xl md:text-2xl">Contact Us</div>

          <div className="w-full max-w-52 space-y-1 text-sm sm:max-w-72 md:text-lg">
            <div className="flex gap-3 font-questrial">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-blue-500" />
              <span>
                123 Detailers Way,
                <br />
                Auto City, ST 12345
              </span>
            </div>
            <div className="flex-between flex items-center gap-3 font-questrial">
              <FaPhoneAlt className="shrink-0 text-blue-500" />
              <a href="tel:+1234567890" className="hover:text-white">
                (123) 456-7890
              </a>
            </div>
            <div className="flex items-center gap-3 font-questrial">
              <FaEnvelope className="shrink-0 text-blue-500" />
              <a href="mailto:info@onyxwash.com" className="hover:text-white">
                info@onyxwash.com
              </a>
            </div>
          </div>
        </div>
        {/* Contact Info */}
      </div>
    </div>
  );
};

export default ShopInfoSection;
