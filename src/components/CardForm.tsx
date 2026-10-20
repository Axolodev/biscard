"use client";

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

const ERROR_CORRECTION_OPTIONS: readonly {
  value: QrErrorCorrection;
  label: string;
}[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

const GRID = "grid grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-3";

// TODO: Make it so text fields behave normally

/**
 * The full card form: card dimensions plus the Text, QR Code and NFC Chip
 * property groups. Fully controlled; matches Figma nodes 19:8036 (desktop)
 * and 21:10471 (mobile).
 */
export function CardForm({ state, onChange, className }: CardFormProps) {
  const { card, textBlock, qrCode, nfcChip } = state;

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
        <legend className="sr-only">Card</legend>
        <NumberField
          label="Width"
          value={card.width}
          onValueChange={(width) => setCard({ width })}
        />
        <NumberField
          label="Height"
          value={card.height}
          onValueChange={(height) => setCard({ height })}
        />
        <NumberField
          label="Thickness"
          value={card.thickness}
          onValueChange={(thickness) => setCard({ thickness })}
        />
        <NumberField
          className="md:col-span-3"
          label="Border Radius"
          value={card.borderRadius}
          onValueChange={(borderRadius) => setCard({ borderRadius })}
        />
      </fieldset>

      <PropertyGroup
        label="Include text block?"
        legend="Text Properties"
        checked={textBlock.enabled}
        onToggleChange={(enabled) => setText({ enabled })}
      >
        <div className={GRID}>
          <div className="grid grid-cols-3 gap-x-2 md:col-span-3">
            <NumberField
              label="X position"
              value={textBlock.xPosition}
              onValueChange={(xPosition) => setText({ xPosition })}
            />
            <NumberField
              label="Y Position"
              value={textBlock.yPosition}
              onValueChange={(yPosition) => setText({ yPosition })}
            />
            <NumberField
              label="Z Position"
              value={textBlock.zPosition}
              onValueChange={(zPosition) => setText({ zPosition })}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label="Thickness"
              value={textBlock.thickness}
              onValueChange={(thickness) => setText({ thickness })}
            />
            <NumberField
              label="Font size"
              unit=""
              value={textBlock.fontSize}
              onValueChange={(fontSize) => setText({ fontSize })}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label="Line height"
              unit=""
              value={textBlock.lineHeight}
              onValueChange={(lineHeight) => setText({ lineHeight })}
              allowDecimals={true}
            />
            <SelectField
              label="Font"
              value={textBlock.fontFamily}
              options={FONT_OPTIONS}
              onValueChange={(fontFamily) => setText({ fontFamily })}
            />
          </div>

          <TextAreaField
            className="md:col-span-3"
            label="Text content"
            value={textBlock.content}
            onValueChange={(content) => setText({ content })}
          />
        </div>
      </PropertyGroup>

      <PropertyGroup
        label="Include QR Code?"
        legend="QR Code Properties"
        checked={qrCode.enabled}
        onToggleChange={(enabled) => setQr({ enabled })}
      >
        <div className={GRID}>
          <div className="grid grid-cols-3 gap-x-2 md:col-span-3">
            <NumberField
              label="X position"
              value={qrCode.xPosition}
              onValueChange={(xPosition) => setQr({ xPosition })}
            />
            <NumberField
              label="Y Position"
              value={qrCode.yPosition}
              onValueChange={(yPosition) => setQr({ yPosition })}
            />
            <NumberField
              label="Z Position"
              value={qrCode.zPosition}
              onValueChange={(zPosition) => setQr({ zPosition })}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 md:col-span-3">
            <NumberField
              label="Module size"
              value={qrCode.moduleSize}
              onValueChange={(moduleSize) => setQr({ moduleSize })}
              allowDecimals
            />
            <NumberField
              label="Thickness"
              value={qrCode.thickness}
              onValueChange={(thickness) => setQr({ thickness })}
            />
          </div>

          <TextField
            className="md:col-span-3"
            label="QR code text (can be a link)"
            placeholder="https://example.com/"
            value={qrCode.qrContent}
            onValueChange={(qrContent) => setQr({ qrContent })}
          />
          <SelectField
            className="md:col-span-3"
            label="Error correction"
            value={qrCode.errorCorrection}
            options={ERROR_CORRECTION_OPTIONS}
            onValueChange={(errorCorrection) => setQr({ errorCorrection })}
          />
          <PropertyGroup
            className="md:col-span-3"
            label="Include border around QR code?"
            legend=""
            fieldsetClassName="p-0"
            checked={qrCode.border.enabled}
            onToggleChange={(enabled) => setQrBorder({ enabled })}
          >
            <div className={GRID}>
              <NumberField
                label="Offset from QR code"
                value={qrCode.border.offset}
                onValueChange={(offset) => setQrBorder({ offset })}
              />
              <NumberField
                label="Border radius"
                value={qrCode.border.borderRadius}
                onValueChange={(borderRadius) => setQrBorder({ borderRadius })}
              />
              <NumberField
                label="Border thickness"
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
        label="Leave slot for an NFC chip?"
        legend="NFC Chip Properties"
        checked={nfcChip.enabled}
        onToggleChange={(enabled) => setNfc({ enabled })}
      >
        <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
          <NumberField
            label="Diameter"
            value={nfcChip.diameter}
            onValueChange={(diameter) => setNfc({ diameter })}
          />
          <NumberField
            label="Thickness"
            value={nfcChip.thickness}
            onValueChange={(thickness) => setNfc({ thickness })}
          />
        </div>
      </PropertyGroup>
    </form>
  );
}
