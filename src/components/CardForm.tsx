"use client";

import { useTranslations } from "next-intl";
import {
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "./FormFields";
import { PropertyGroup } from "./PropertyGroup";
import type { QrErrorCorrection } from "./cardFormTypes";
import useModelStore from "@/store/modelStore";

export interface CardFormProps {
  className?: string;
}

const FONT_OPTIONS = [
  {
    label: "Roboto",
    value: "Roboto_Regular",
  },
  {
    label: "Roboto Bold",
    value: "Roboto_Bold",
  },
  {
    label: "Roboto Extra Bold",
    value: "Roboto_ExtraBold",
  },
].map(({ value, label }) => ({ value, label }));

const ERROR_CORRECTION_KEYS: Record<QrErrorCorrection, string> = {
  L: "errorLow",
  M: "errorMedium",
  Q: "errorQuartile",
  H: "errorHigh",
};

const GRID = "grid grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-3";

// TODO: Make it so number fields behave normally
export function CardForm({ className }: CardFormProps) {
  const t = useTranslations("cardForm");
  const state = useModelStore((s) => s.form);
  const onChange = useModelStore((s) => s.setForm);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 md:col-span-3">
            <NumberField
              label={t("xPosition")}
              value={textBlock.xPosition}
              onValueChange={(xPosition) => setText({ xPosition })}
            />
            <NumberField
              label={t("yPosition")}
              value={textBlock.yPosition}
              onValueChange={(yPosition) => setText({ yPosition })}
            />
            <NumberField
              label={t("zPosition")}
              value={textBlock.zPosition}
              onValueChange={(zPosition) => setText({ zPosition })}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label={t("thickness")}
              value={textBlock.thickness}
              onValueChange={(thickness) => setText({ thickness })}
            />
            <NumberField
              label={t("text.fontSize")}
              unit=""
              value={textBlock.fontSize}
              onValueChange={(fontSize) => setText({ fontSize })}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label={t("text.lineHeight")}
              unit=""
              value={textBlock.lineHeight}
              onValueChange={(lineHeight) => setText({ lineHeight })}
              allowDecimals={true}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 md:col-span-3">
            <NumberField
              label={t("xPosition")}
              value={qrCode.xPosition}
              onValueChange={(xPosition) => setQr({ xPosition })}
            />
            <NumberField
              label={t("yPosition")}
              value={qrCode.yPosition}
              onValueChange={(yPosition) => setQr({ yPosition })}
            />
            <NumberField
              label={t("zPosition")}
              value={qrCode.zPosition}
              onValueChange={(zPosition) => setQr({ zPosition })}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label={t("qr.moduleSize")}
              value={qrCode.moduleSize}
              onValueChange={(moduleSize) => setQr({ moduleSize })}
              allowDecimals
            />
            <NumberField
              label={t("thickness")}
              value={qrCode.thickness}
              onValueChange={(thickness) => setQr({ thickness })}
            />
          </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 md:col-span-3">
          <NumberField
            label={t("xPosition")}
            value={nfcChip.xPosition}
            onValueChange={(xPosition) => setNfc({ xPosition })}
          />
          <NumberField
            label={t("yPosition")}
            value={nfcChip.yPosition}
            onValueChange={(yPosition) => setNfc({ yPosition })}
          />
          <NumberField
            label={t("zPosition")}
            value={nfcChip.zPosition}
            onValueChange={(zPosition) => setNfc({ zPosition })}
          />
        </div>
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
