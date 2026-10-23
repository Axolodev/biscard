export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export interface CardDimensions {
  width: number;
  height: number;
  thickness: number;
  borderRadius: number;
}

export interface TextBlockState {
  enabled: boolean;
  xPosition: number;
  yPosition: number;
  zPosition: number;
  lineHeight: number;
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
  moduleSize: number;
  xPosition: number;
  yPosition: number;
  zPosition: number;
  thickness: number;
  qrContent: string;
  errorCorrection: QrErrorCorrection;
  border: QrCodeBorderState;
}

export interface NfcChipState {
  enabled: boolean;
  diameter: number;
  thickness: number;
  xPosition: number;
  yPosition: number;
  zPosition: number;
}

/** Shape of the whole card form. */
export interface CardFormState {
  card: CardDimensions;
  textBlock: TextBlockState;
  qrCode: QrCodeState;
  nfcChip: NfcChipState;
}

export const initialCardFormState: CardFormState = {
  card: { width: 84, height: 53, thickness: 2, borderRadius: 8 },
  textBlock: {
    enabled: true,
    xPosition: -40,
    yPosition: 14,
    zPosition: 1,
    lineHeight: 1.0,
    thickness: 1,
    fontSize: 16,
    fontFamily: "Roboto_ExtraBold",
    content: "Your name\nYour company\n\nYour Title\nYour Website",
  },
  qrCode: {
    enabled: true,
    moduleSize: 1,
    xPosition: 20,
    yPosition: 0,
    zPosition: 2,
    thickness: 1,
    qrContent: "https://example.com/",
    errorCorrection: "M",
    border: { enabled: true, offset: 2, borderRadius: 4, borderThickness: 1 },
  },
  nfcChip: {
    enabled: true,
    diameter: 25,
    thickness: 2,
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  },
};
