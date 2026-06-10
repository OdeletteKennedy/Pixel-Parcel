import type { Address, Hex } from "viem";

export const pixelParcelAddress = (
  process.env.NEXT_PUBLIC_PIXEL_PARCEL_CONTRACT_ADDRESS ||
  "0xb213da37957c1bfa3c82e83490cad9cef125d0c1"
) as Address;

export const hasPixelParcelAddress = /^0x[a-fA-F0-9]{40}$/.test(
  pixelParcelAddress,
);

export const baseAttributionDataSuffix =
  "0x62635f7470796a70616b6c0b0080218021802180218021802180218021" as Hex;
