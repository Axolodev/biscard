import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { Heading } from "@/components/Heading";
import { Modal } from "@/components/Modal";
import { detectLocale, resolveLocale } from "./config";
import en from "./en.json";
import es from "./es.json";
import { renderWithIntl } from "./testUtils";

function keysOf(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

function localeCookie() {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];
}

afterEach(() => {
  document.cookie = "NEXT_LOCALE=; path=/; max-age=0";
});

describe("translation files", () => {
  it("es.json has exactly the same keys as en.json", () => {
    expect(keysOf(es).sort()).toEqual(keysOf(en).sort());
  });
});

describe("locale detection", () => {
  it("uses the browser's Accept-Language when there is no cookie", () => {
    expect(resolveLocale(undefined, "es-MX,es;q=0.9,en;q=0.8")).toBe("es");
    expect(resolveLocale(undefined, "fr-FR,en;q=0.5")).toBe("en");
    expect(resolveLocale(undefined, "de,es;q=0.4")).toBe("es");
    expect(detectLocale(null)).toBe("en");
  });

  it("prefers the cookie over the browser once it exists", () => {
    expect(resolveLocale("en", "es-MX")).toBe("en");
    expect(resolveLocale("es", "en-US")).toBe("es");
  });

  it("ignores an unsupported cookie value", () => {
    expect(resolveLocale("fr", "es")).toBe("es");
  });
});

describe("language control in the settings modal", () => {
  it("switches every string to Spanish and stores the choice in the cookie", () => {
    renderWithIntl(
      <>
        <Heading onSettingsClick={() => {}} />
        <Modal onClose={() => {}} />
      </>,
    );

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open settings" })).toBeInTheDocument();
    expect(localeCookie()).toBeUndefined();

    fireEvent.click(screen.getByRole("button", { name: "Spanish" }));

    expect(screen.getByRole("heading", { name: "Configuración" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir configuración" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Español" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("heading", { name: "Settings" })).not.toBeInTheDocument();
    expect(localeCookie()).toBe("es");
    expect(document.documentElement.lang).toBe("es");
  });

  it("switches back to English and updates the cookie", () => {
    renderWithIntl(<Modal onClose={() => {}} />, "es");

    expect(screen.getByRole("heading", { name: "Configuración" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Inglés" }));

    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(localeCookie()).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });
});
