import type { Address, Hex } from "viem";

export const pixelParcelAddress = (
  process.env.NEXT_PUBLIC_PIXEL_PARCEL_CONTRACT_ADDRESS ||
  "0xb213da37957c1bfa3c82e83490cad9cef125d0c1"
) as Address;

export const hasPixelParcelAddress = /^0x[a-fA-F0-9]{40}$/.test(
  pixelParcelAddress,
);

// Replace with the ERC-8021 encoded builder code after base.dev verification.
export const baseAttributionDataSuffix =
  "0x62635f706978656c5f70617263656c" as Hex;
