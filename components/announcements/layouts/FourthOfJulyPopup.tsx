import { FiX } from "react-icons/fi";
import { defaultModalTitle } from "@/lib/announcements";
import type { PopupLayoutProps } from "@/lib/popup-announcements";

export default function FourthOfJulyPopup({
  announcement,
  onDismiss,
  titleId,
  descriptionId,
}: PopupLayoutProps) {
  const title =
    announcement.title?.trim() || defaultModalTitle(announcement.kind);

  return (
    <div
      className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-[#0b1a4a] text-white shadow-2xl"
      onClick={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="h-2 w-full bg-[repeating-linear-gradient(90deg,#b91c1c_0_16px,#f8fafc_16px_32px,#1d4ed8_32px_48px)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <span className="absolute top-8 left-6 text-lg text-yellow-200">★</span>
        <span className="absolute top-16 right-10 text-sm text-white">★</span>
        <span className="absolute top-28 left-1/3 text-base text-red-200">
          ★
        </span>
        <span className="absolute right-8 bottom-24 text-lg text-yellow-100">
          ★
        </span>
        <span className="absolute bottom-16 left-10 text-sm text-blue-100">
          ★
        </span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-4 right-4 z-10 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close announcement"
      >
        <FiX className="h-5 w-5" />
      </button>

      <div className="relative px-6 pt-10 pb-7 sm:px-10">
        <p className="mb-4 inline-flex rounded-full border border-yellow-300/40 bg-red-600/30 px-3 py-1 font-questrial text-[11px] font-bold tracking-[0.22em] text-yellow-200 uppercase">
          Independence Day
        </p>
        <h2
          id={titleId}
          className="pr-8 font-lexend text-3xl font-bold tracking-tight text-white"
        >
          {title}
        </h2>
        <p
          id={descriptionId}
          className="mt-4 font-questrial text-base leading-relaxed text-blue-50/90"
        >
          {announcement.message}
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-white/25 px-5 py-2.5 font-questrial text-sm font-bold tracking-wider text-white/80 uppercase transition-colors hover:border-white/50 hover:text-white"
          >
            Close
          </button>
          {announcement.link_url ? (
            <a
              href={announcement.link_url}
              onClick={onDismiss}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-center font-questrial text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-500"
            >
              Claim offer
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
