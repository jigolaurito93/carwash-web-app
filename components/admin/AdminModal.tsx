"use client";

import { useId, type FormEventHandler, type ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  md: "max-w-md",
  lg: "max-w-lg",
  "4xl": "max-w-4xl",
} as const;

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: keyof typeof MAX_WIDTH;
  closeDisabled?: boolean;
  preventOverlayClose?: boolean;
  titleTone?: "default" | "danger";
  asForm?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

export default function AdminModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  closeDisabled = false,
  preventOverlayClose = false,
  titleTone = "default",
  asForm = false,
  onSubmit,
}: Props) {
  const titleId = useId();

  if (!open) return null;

  const closeIfIdle = () => {
    if (closeDisabled) return;
    onClose();
  };

  const body = (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
      {footer ? (
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          {footer}
        </div>
      ) : null}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (closeDisabled || preventOverlayClose) return;
        onClose();
      }}
    >
      <div
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl",
          MAX_WIDTH[maxWidth],
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 bg-gray-100 px-6 py-4">
          <div className="min-w-0">
            <h2
              id={titleId}
              className={cn(
                "font-lexend text-xl font-bold sm:text-2xl",
                titleTone === "danger" ? "text-red-700" : "text-gray-900",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1 font-questrial text-sm text-gray-500">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={closeDisabled}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </header>
        {asForm ? (
          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            {body}
          </form>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">{body}</div>
        )}
      </div>
    </div>
  );
}
