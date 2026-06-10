"use client";

import {
  Archive,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  PackageCheck,
  RadioTower,
  ScanBarcode,
  Send,
  ShieldCheck,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Address, Hex } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { pixelParcelAbi } from "@/lib/abi";
import {
  baseAttributionDataSuffix,
  hasPixelParcelAddress,
  pixelParcelAddress,
} from "@/lib/contract";

type ActionKey = "pack" | "seal" | "send";
type ActivityState =
  | "Ready"
  | "Pending"
  | "Confirmed"
  | "Failed"
  | "Request rejected"
  | "Connect wallet first";

const actionCopy: Record<
  ActionKey,
  {
    label: string;
    functionName: "packBox" | "sealLabel" | "sendParcel";
    icon: typeof Archive;
    lane: string;
  }
> = {
  pack: {
    label: "Pack Box",
    functionName: "packBox",
    icon: Boxes,
    lane: "Box station",
  },
  seal: {
    label: "Seal Label",
    functionName: "sealLabel",
    icon: PackageCheck,
    lane: "Label press",
  },
  send: {
    label: "Send Parcel",
    functionName: "sendParcel",
    icon: Send,
    lane: "Dispatch rail",
  },
};

function shortAddress(address?: Address) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function friendlyError(error: unknown): ActivityState {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  console.error("Pixel Parcel transaction detail:", error);
  if (
    message.includes("user rejected") ||
    message.includes("rejected") ||
    message.includes("denied")
  ) {
    return "Request rejected";
  }
  return "Failed";
}

function formatCount(value: unknown) {
  if (typeof value === "bigint") return value.toString();
  return "0";
}

export function PixelParcelApp() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [activity, setActivity] = useState<ActivityState>("Ready");
  const [lastHash, setLastHash] = useState<Hex | undefined>();
  const [lastAction, setLastAction] = useState<ActionKey | null>(null);

  const enabledReads = hasPixelParcelAddress;
  const reads = useReadContracts({
    allowFailure: true,
    query: {
      enabled: enabledReads,
      refetchInterval: 8000,
    },
    contracts: [
      {
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: "totalPacks",
        chainId: base.id,
      },
      {
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: "totalSeals",
        chainId: base.id,
      },
      {
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: "totalSends",
        chainId: base.id,
      },
      {
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: "userPacks",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: base.id,
      },
      {
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: "userSeals",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: base.id,
      },
      {
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: "userSends",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: base.id,
      },
    ],
  });

  const receipt = useWaitForTransactionReceipt({
    hash: lastHash,
    chainId: base.id,
    query: {
      enabled: Boolean(lastHash),
    },
  });

  useEffect(() => {
    if (!receipt.data) return;
    if (receipt.data.status === "success") {
      void reads.refetch();
      return;
    }
  }, [receipt.data, reads]);

  const data = reads.data ?? [];
  const totals = {
    packs: formatCount(data[0]?.result),
    seals: formatCount(data[1]?.result),
    sends: formatCount(data[2]?.result),
  };
  const mine = {
    packs: formatCount(data[3]?.result),
    seals: formatCount(data[4]?.result),
    sends: formatCount(data[5]?.result),
  };

  const walletStatus = !isConnected
    ? "Disconnected"
    : chainId === base.id
      ? "Base connected"
      : "Switch to Base";

  const confirmedReceipt =
    receipt.data?.transactionHash === lastHash ? receipt.data : undefined;
  const visibleActivity =
    confirmedReceipt?.status === "success"
      ? "Confirmed"
      : confirmedReceipt?.status === "reverted"
        ? "Failed"
        : activity;

  async function runAction(action: ActionKey) {
    setLastAction(action);
    setActiveAction(action);
    if (!isConnected) {
      setActivity("Connect wallet first");
      setActiveAction(null);
      return;
    }
    if (!hasPixelParcelAddress) {
      setActivity("Failed");
      setActiveAction(null);
      return;
    }

    try {
      setActivity("Pending");
      const hash = await writeContractAsync({
        address: pixelParcelAddress,
        abi: pixelParcelAbi,
        functionName: actionCopy[action].functionName,
        chainId: base.id,
        dataSuffix: baseAttributionDataSuffix,
      });
      setLastHash(hash);
    } catch (error) {
      setActivity(friendlyError(error));
      setActiveAction(null);
    }
  }

  const visibleConnectors = connectors.filter((connector, index, all) => {
    return all.findIndex((item) => item.id === connector.id) === index;
  });

  return (
    <main className="min-h-dvh bg-[#f4dfb7] text-[#17120d]">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="grid gap-3 border-4 border-[#17120d] bg-[#fff4d6] p-3 shadow-[6px_6px_0_#17120d] md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center border-4 border-[#17120d] bg-[#0052ff] text-white shadow-[3px_3px_0_#17120d]">
              <Truck className="size-7" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#d72f2f]">
                Onchain parcel desk
              </p>
              <h1 className="font-mono text-3xl font-black uppercase leading-none sm:text-4xl">
                Pixel Parcel
              </h1>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setWalletMenuOpen((open) => !open)}
              className="flex min-h-12 w-full items-center justify-between gap-3 border-4 border-[#17120d] bg-[#0052ff] px-3 font-mono text-sm font-black uppercase text-white shadow-[4px_4px_0_#17120d] transition active:translate-x-1 active:translate-y-1 active:shadow-none md:w-72"
            >
              <Wallet className="size-5" />
              <span>{isConnected ? shortAddress(address) : "Connect Wallet"}</span>
              <ChevronDown className="size-5" />
            </button>
            {walletMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-full border-4 border-[#17120d] bg-white p-2 shadow-[5px_5px_0_#17120d] md:w-80">
                <div className="mb-2 flex items-center justify-between border-b-4 border-[#17120d] pb-2 font-mono text-xs font-black uppercase">
                  Wallet options
                  <button
                    type="button"
                    onClick={() => setWalletMenuOpen(false)}
                    aria-label="Close wallet options"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="grid gap-2">
                  {visibleConnectors.map((connector) => (
                    <button
                      key={connector.uid}
                      type="button"
                      disabled={isConnecting}
                      onClick={() => {
                        connect({ connector, chainId: base.id });
                        setWalletMenuOpen(false);
                      }}
                      className="flex items-center justify-between border-2 border-[#17120d] bg-[#fff4d6] px-3 py-2 text-left font-mono text-sm font-black uppercase hover:bg-[#ffe08a] disabled:opacity-60"
                    >
                      {connector.name}
                      <RadioTower className="size-4" />
                    </button>
                  ))}
                  {isConnected && (
                    <button
                      type="button"
                      onClick={() => {
                        disconnect();
                        setWalletMenuOpen(false);
                      }}
                      className="border-2 border-[#17120d] bg-[#d72f2f] px-3 py-2 text-left font-mono text-sm font-black uppercase text-white"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="grid flex-1 gap-4 py-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="border-4 border-[#17120d] bg-[#c68b52] p-3 shadow-[6px_6px_0_#17120d]">
            <div className="grid min-h-[520px] grid-rows-[auto_1fr_auto] gap-4 border-4 border-[#17120d] bg-[#edc27c] p-3">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div className="border-4 border-[#17120d] bg-[#fff4d6] p-3">
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs font-black uppercase text-[#0052ff]">
                    <ScanBarcode className="size-4" />
                    Live counter rail
                  </div>
                  <div className="flex h-10 items-end gap-1 overflow-hidden">
                    {Array.from({ length: 24 }).map((_, index) => (
                      <span
                        key={index}
                        className={`block w-2 bg-[#17120d] ${
                          index % 4 === 0 ? "h-9" : index % 3 === 0 ? "h-6" : "h-8"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="hidden w-28 border-4 border-[#17120d] bg-[#0052ff] p-2 text-white sm:block">
                  <p className="font-mono text-[10px] font-black uppercase">
                    Base line
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span key={index} className="aspect-square bg-white" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden border-4 border-[#17120d] bg-[#7a5838] p-3">
                <div className="absolute inset-x-0 top-0 grid grid-cols-8 gap-2 bg-[#17120d] p-2 opacity-25">
                  {Array.from({ length: 32 }).map((_, index) => (
                    <span key={index} className="h-3 bg-white" />
                  ))}
                </div>
                <div className="relative grid h-full grid-rows-[1fr_auto] gap-4">
                  <div className="grid grid-cols-3 gap-3 pt-8">
                    {["PX-01", "PX-02", "PX-03", "PX-04", "PX-05", "PX-06"].map(
                      (box, index) => (
                        <div
                          key={box}
                          className="min-h-24 border-4 border-[#17120d] bg-[#d99a59] p-2 shadow-[4px_4px_0_#17120d]"
                        >
                          <div className="mb-2 h-3 border-y-2 border-[#17120d] bg-[#f4dfb7]" />
                          <p className="font-mono text-xs font-black">{box}</p>
                          <div className="mt-3 grid grid-cols-4 gap-1">
                            {Array.from({ length: index + 3 }).map((_, dot) => (
                              <span
                                key={dot}
                                className="aspect-square bg-[#17120d]"
                              />
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {(Object.keys(actionCopy) as ActionKey[]).map((key) => {
                      const item = actionCopy[key];
                      const Icon = item.icon;
                      const busy =
                        isWriting || (receipt.isLoading && activeAction === key);
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={busy}
                          onClick={() => void runAction(key)}
                          className="group min-h-24 border-4 border-[#17120d] bg-[#fff4d6] p-3 text-left shadow-[5px_5px_0_#17120d] transition hover:bg-[#ffe08a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-70"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <Icon className="size-6 text-[#d72f2f]" />
                            <span className="font-mono text-[10px] font-black uppercase text-[#0052ff]">
                              {item.lane}
                            </span>
                          </div>
                          <span className="block font-mono text-lg font-black uppercase leading-tight">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="My Packs" value={mine.packs} total={totals.packs} />
                <Metric label="My Seals" value={mine.seals} total={totals.seals} />
                <Metric label="My Sends" value={mine.sends} total={totals.sends} />
              </div>
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <Panel title="Wallet Status" icon={ShieldCheck}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-2xl font-black uppercase">
                  {walletStatus}
                </p>
                <span
                  className={`size-4 border-2 border-[#17120d] ${
                    isConnected && chainId === base.id
                      ? "bg-[#23b26d]"
                      : "bg-[#d72f2f]"
                  }`}
                />
              </div>
              <p className="mt-2 font-mono text-xs uppercase text-[#5b4630]">
                {shortAddress(address)}
              </p>
            </Panel>

            <Panel title="Last Transaction" icon={activity === "Confirmed" ? CheckCircle2 : CircleAlert}>
              <p className="font-mono text-2xl font-black uppercase">
                {visibleActivity}
              </p>
              <p className="mt-2 font-mono text-xs uppercase text-[#5b4630]">
                {lastAction ? actionCopy[lastAction].label : "No parcel action yet"}
              </p>
            </Panel>

            <Panel title="Recent Activity" icon={BadgeCheck}>
              <div className="grid gap-2">
                {[
                  ["Pack queue", mine.packs, totals.packs],
                  ["Seal queue", mine.seals, totals.seals],
                  ["Send queue", mine.sends, totals.sends],
                ].map(([label, myValue, totalValue]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[1fr_auto] items-center gap-2 border-2 border-[#17120d] bg-[#fff4d6] px-3 py-2"
                  >
                    <span className="font-mono text-xs font-black uppercase">
                      {label}
                    </span>
                    <span className="font-mono text-sm font-black">
                      {myValue}/{totalValue}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="border-4 border-[#17120d] bg-[#fff4d6] p-3 shadow-[6px_6px_0_#17120d]">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <p className="font-mono text-xs font-black uppercase text-[#d72f2f]">
                    Shipping label
                  </p>
                  <p className="mt-2 font-mono text-lg font-black uppercase">
                    Gas only. No token. No rewards.
                  </p>
                </div>
                <div className="grid size-20 grid-cols-5 gap-1 border-2 border-[#17120d] bg-white p-1">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index % 2 === 0 || index % 7 === 0
                          ? "bg-[#17120d]"
                          : "bg-transparent"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  total,
}: {
  label: string;
  value: string;
  total: string;
}) {
  return (
    <div className="border-4 border-[#17120d] bg-[#fff4d6] p-3 shadow-[4px_4px_0_#17120d]">
      <p className="font-mono text-xs font-black uppercase text-[#d72f2f]">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="font-mono text-3xl font-black leading-none">{value}</span>
        <span className="font-mono text-xs font-black uppercase text-[#0052ff]">
          Total {total}
        </span>
      </div>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Archive;
  children: React.ReactNode;
}) {
  return (
    <section className="border-4 border-[#17120d] bg-white p-3 shadow-[6px_6px_0_#17120d]">
      <div className="mb-3 flex items-center gap-2 border-b-4 border-[#17120d] pb-2">
        <Icon className="size-5 text-[#0052ff]" />
        <h2 className="font-mono text-sm font-black uppercase">{title}</h2>
      </div>
      {children}
    </section>
  );
}
