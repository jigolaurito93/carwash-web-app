"use client";

import Link from "next/link";

type Props = {
  phone: string | null;
};

export default function HeroCta({ phone }: Props) {
  const telHref = phone ? `tel:${phone}` : null;

  function handleClick() {
    if (!telHref) return;

    const link = document.createElement("a");
    link.href = telHref;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <Link
      href="/contact"
      onClick={handleClick}
      className="mt-14 inline-block cursor-pointer rounded-full bg-white px-8 py-4 text-center font-lexend text-xs shadow-2xl transition-colors duration-300 ease-in-out hover:bg-black/30 hover:text-white hover:shadow-white md:text-sm"
    >
      Call to schedule an Appointment
    </Link>
  );
}
