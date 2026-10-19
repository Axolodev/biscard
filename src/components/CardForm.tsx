"use client";

import { useTranslations } from "next-intl";
import {
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "./FormFields";
import { PropertyGroup } from "./PropertyGroup";
import type { CardFormState, QrErrorCorrection } from "./cardFormTypes";

export interface CardFormProps {
  /** Current form values. Owned by the parent (a Zustand store later on). */
  state: CardFormState;
  /** Called with the complete next state whenever any field changes. */
  onChange: (next: CardFormState) => void;
  className?: string;
}

const FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
].map((f) => ({ value: f, label: f }));

const ERROR_CORRECTION_KEYS: Record<QrErrorCorrection, string> = {
  L: "errorLow",
  M: "errorMedium",
  Q: "errorQuartile",
  H: "errorHigh",
};

const GRID = "grid grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-3";

/**
 * The full card form: card dimensions plus the Text, QR Code and NFC Chip
 * property groups. Fully controlled; matches Figma nodes 19:8036 (desktop)
 * and 21:10471 (mobile).
 */
export function CardForm({ state, onChange, className }: CardFormProps) {
  const t = useTranslations("cardForm");
  const { card, textBlock, qrCode, nfcChip } = state;
  const errorCorrectionOptions = (
    Object.keys(ERROR_CORRECTION_KEYS) as QrErrorCorrection[]
  ).map((value) => ({
    value,
    label: t(`qr.${ERROR_CORRECTION_KEYS[value]}`),
  }));

  const setCard = (patch: Partial<typeof card>) =>
    onChange({ ...state, card: { ...card, ...patch } });
  const setText = (patch: Partial<typeof textBlock>) =>
    onChange({ ...state, textBlock: { ...textBlock, ...patch } });
  const setQr = (patch: Partial<typeof qrCode>) =>
    onChange({ ...state, qrCode: { ...qrCode, ...patch } });
  const setQrBorder = (patch: Partial<typeof qrCode.border>) =>
    setQr({ border: { ...qrCode.border, ...patch } });
  const setNfc = (patch: Partial<typeof nfcChip>) =>
    onChange({ ...state, nfcChip: { ...nfcChip, ...patch } });

  return (
    <form
      className={`bg-base-200 border-base-300 rounded-box flex flex-col gap-6 border p-6 md:p-6 ${className ?? ""}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset className={GRID}>
        <legend className="sr-only">{t("card")}</legend>
        <NumberField
          label={t("width")}
          value={card.width}
          onValueChange={(width) => setCard({ width })}
        />
        <NumberField
          label={t("height")}
          value={card.height}
          onValueChange={(height) => setCard({ height })}
        />
        <NumberField
          label={t("thickness")}
          value={card.thickness}
          onValueChange={(thickness) => setCard({ thickness })}
        />
        <NumberField
          className="md:col-span-3"
          label={t("borderRadius")}
          value={card.borderRadius}
          onValueChange={(borderRadius) => setCard({ borderRadius })}
        />
      </fieldset>

      <PropertyGroup
        label={t("text.toggle")}
        legend={t("text.legend")}
        checked={textBlock.enabled}
        onToggleChange={(enabled) => setText({ enabled })}
      >
        <div className={GRID}>
          <NumberField
            label={t("width")}
            value={textBlock.width}
            onValueChange={(width) => setText({ width })}
          />
          <NumberField
            label={t("height")}
            value={textBlock.height}
            onValueChange={(height) => setText({ height })}
          />
          <NumberField
            label={t("thickness")}
            value={textBlock.thickness}
            onValueChange={(thickness) => setText({ thickness })}
          />
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label={t("text.fontSize")}
              unit=""
              value={textBlock.fontSize}
              onValueChange={(fontSize) => setText({ fontSize })}
            />
            <SelectField
              label={t("text.font")}
              value={textBlock.fontFamily}
              options={FONT_OPTIONS}
              onValueChange={(fontFamily) => setText({ fontFamily })}
            />
          </div>
          <TextAreaField
            className="md:col-span-3"
            label={t("text.content")}
            value={textBlock.content}
            onValueChange={(content) => setText({ content })}
          />
        </div>
      </PropertyGroup>

      <PropertyGroup
        label={t("qr.toggle")}
        legend={t("qr.legend")}
        checked={qrCode.enabled}
        onToggleChange={(enabled) => setQr({ enabled })}
      >
        <div className={GRID}>
          <NumberField
            label={t("width")}
            value={qrCode.width}
            onValueChange={(width) => setQr({ width })}
          />
          <NumberField
            label={t("height")}
            value={qrCode.height}
            onValueChange={(height) => setQr({ height })}
          />
          <NumberField
            label={t("thickness")}
            value={qrCode.thickness}
            onValueChange={(thickness) => setQr({ thickness })}
          />
          <TextField
            className="md:col-span-3"
            label={t("qr.content")}
            placeholder="https://example.com/"
            value={qrCode.qrContent}
            onValueChange={(qrContent) => setQr({ qrContent })}
          />
          <SelectField
            className="md:col-span-3"
            label={t("qr.errorCorrection")}
            value={qrCode.errorCorrection}
            options={errorCorrectionOptions}
            onValueChange={(errorCorrection) => setQr({ errorCorrection })}
          />
          <PropertyGroup
            className="md:col-span-3"
            label={t("qr.borderToggle")}
            legend=""
            fieldsetClassName="p-0"
            checked={qrCode.border.enabled}
            onToggleChange={(enabled) => setQrBorder({ enabled })}
          >
            <div className={GRID}>
              <NumberField
                label={t("qr.borderOffset")}
                value={qrCode.border.offset}
                onValueChange={(offset) => setQrBorder({ offset })}
              />
              <NumberField
                label={t("qr.borderRadius")}
                value={qrCode.border.borderRadius}
                onValueChange={(borderRadius) => setQrBorder({ borderRadius })}
              />
              <NumberField
                label={t("qr.borderThickness")}
                value={qrCode.border.borderThickness}
                onValueChange={(borderThickness) =>
                  setQrBorder({ borderThickness })
                }
              />
            </div>
          </PropertyGroup>
        </div>
      </PropertyGroup>

      <PropertyGroup
        label={t("nfc.toggle")}
        legend={t("nfc.legend")}
        checked={nfcChip.enabled}
        onToggleChange={(enabled) => setNfc({ enabled })}
      >
        <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
          <NumberField
            label={t("nfc.diameter")}
            value={nfcChip.diameter}
            onValueChange={(diameter) => setNfc({ diameter })}
          />
          <NumberField
            label={t("thickness")}
            value={nfcChip.thickness}
            onValueChange={(thickness) => setNfc({ thickness })}
          />
        </div>
      </PropertyGroup>
    </form>
  );
}
