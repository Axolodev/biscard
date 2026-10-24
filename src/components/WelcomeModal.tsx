"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { version } from "../../package.json";

export const WELCOME_APP_VERSION = version;

const LINKS = {
  author: "https://github.com/Axolodev",
  issues: "https://github.com/Axolodev/g3co/issues",
  bluesky: "https://bsky.app/profile/robruizr.dev",
};

function externalLink(href: string) {
  return function ExternalLink(chunks: ReactNode) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
        {chunks}
      </a>
    );
  };
}

export interface WelcomeModalProps {
  /** Called by the corner "✕", the "Close" button, or a backdrop click. */
  onClose: () => void;
}

/**
 * Welcome / about modal. Matches Figma node 193:4513. Renders open whenever
 * mounted; the caller decides when to mount it.
 */
export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const t = useTranslations("welcome");
  return (
    <dialog open aria-label={t("ariaLabel")} className="modal">
      <div className="modal-box relative max-w-[512px]">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- see Modal.tsx */}
          <img
            src="/modal-close.svg"
            width={12}
            height={12}
            alt=""
            className="h-3 w-3"
          />
        </button>

        <h3 className="text-xl font-bold">{t("title")}</h3>

        <div className="flex flex-col gap-4 py-5">
          <section className="flex flex-col gap-2">
            <h4 className="text-lg">{t("whatTitle")}</h4>
            <p>{t("whatBody")}</p>
          </section>
          <section className="flex flex-col gap-2">
            <h4 className="text-lg">{t("whoTitle")}</h4>
            <p>{t.rich("whoBody", { author: externalLink(LINKS.author) })}</p>
          </section>
          <section className="flex flex-col gap-2">
            <h4 className="text-lg">{t("cookiesTitle")}</h4>
            <p>{t("cookiesBody")}</p>
          </section>
          <section className="flex flex-col gap-2">
            <h4 className="text-lg">{t("problemsTitle")}</h4>
            <p>
              {t.rich("problemsBody", {
                issues: externalLink(LINKS.issues),
                bluesky: externalLink(LINKS.bluesky),
              })}
            </p>
          </section>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-base-content/50 flex-1 text-xs font-semibold">
            {WELCOME_APP_VERSION}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary btn-sm"
          >
            {t("close")}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={t("closeBackdrop")}
        className="modal-backdrop"
      />
    </dialog>
  );
}
