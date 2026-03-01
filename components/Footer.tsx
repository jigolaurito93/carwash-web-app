import Link from "next/link";
import {
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { MdLocalCarWash } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-8 pt-16 pb-8 text-slate-300 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Brand & Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <MdLocalCarWash className="text-3xl text-blue-500" />
            <span className="font-lexend text-xl font-bold tracking-tighter">
              ONYX PREMIUM
            </span>
          </div>
          <p className="font-questrial text-sm leading-relaxed">
            Setting the gold standard in automotive care. We provide
            professional, hand-wash services that protect your investment and
            restore your pride.
          </p>
          <div className="flex gap-4 pt-2">
            <Link
              href="https://instagram.com"
              className="transition-colors hover:text-blue-500"
            >
              <FaInstagram size={20} />
            </Link>
            <Link
              href="https://facebook.com"
              className="transition-colors hover:text-blue-500"
            >
              <FaFacebook size={20} />
            </Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="mb-6 font-lexend font-bold text-white">Quick Links</h4>
          <ul className="space-y-3 font-questrial text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="transition-colors hover:text-white"
              >
                Wash Packages
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="transition-colors hover:text-white"
              >
                Our Work
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="transition-colors hover:text-white"
              >
                About Onyx
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors hover:text-white">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Hours */}
        <div>
          <h4 className="mb-6 font-lexend font-bold text-white">
            Operating Hours
          </h4>
          <ul className="space-y-2 font-questrial text-sm">
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

        {/* Column 4: Contact Info */}
        <div className="space-y-4 font-lexend">
          <h4 className="mb-6 font-bold text-white">Contact Us</h4>
          <div className="flex items-start gap-3 font-questrial text-sm">
            <FaMapMarkerAlt className="mt-1 shrink-0 text-blue-500" />
            <span>
              123 Detailers Way,
              <br />
              Auto City, ST 12345
            </span>
          </div>
          <div className="flex items-center gap-3 font-questrial text-sm">
            <FaPhoneAlt className="shrink-0 text-blue-500" />
            <a href="tel:+1234567890" className="hover:text-white">
              (123) 456-7890
            </a>
          </div>
          <div className="flex items-center gap-3 font-questrial text-sm">
            <FaEnvelope className="shrink-0 text-blue-500" />
            <a href="mailto:info@onyxwash.com" className="hover:text-white">
              info@onyxwash.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-900 px-6 pt-8 text-xs text-slate-500 md:flex-row">
        <p>© {currentYear} Onyx Premium Carwash. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-slate-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-300">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
