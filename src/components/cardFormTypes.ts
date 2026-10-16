export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export interface CardDimensions {
  width: number;
  height: number;
  thickness: number;
  borderRadius: number;
}

export interface TextBlockState {
  enabled: boolean;
  width: number;
  height: number;
  thickness: number;
  fontSize: number;
  fontFamily: string;
  content: string;
}

export interface QrCodeBorderState {
  enabled: boolean;
  offset: number;
  borderRadius: number;
  borderThickness: number;
}

export interface QrCodeState {
  enabled: boolean;
  width: number;
  height: number;
  thickness: number;
  qrContent: string;
  errorCorrection: QrErrorCorrection;
  border: QrCodeBorderState;
}

export interface NfcChipState {
  enabled: boolean;
  diameter: number;
  thickness: number;
}

/** Shape of the whole card form. */
export interface CardFormState {
  card: CardDimensions;
  textBlock: TextBlockState;
  qrCode: QrCodeState;
  nfcChip: NfcChipState;
}

export const initialCardFormState: CardFormState = {
  card: { width: 88, height: 50, thickness: 2, borderRadius: 8 },
  textBlock: {
    enabled: true,
    width: 43,
    height: 43,
    thickness: 2,
    fontSize: 16,
    fontFamily: "Arial",
    content: "Your name\nYour company",
  },
  qrCode: {
    enabled: true,
    width: 43,
    height: 43,
    thickness: 2,
    qrContent: "",
    errorCorrection: "M",
    border: { enabled: true, offset: 2, borderRadius: 4, borderThickness: 1 },
  },
  nfcChip: { enabled: true, diameter: 25, thickness: 2 },
};
