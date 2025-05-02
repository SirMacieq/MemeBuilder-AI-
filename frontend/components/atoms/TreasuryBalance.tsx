"use client";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";

const TreasuryBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);

  const conn = useConnection();
  const w = useWallet();
  useEffect(() => {
    const pk = w.publicKey;
    if (!pk) return;
    conn.connection.getBalance(pk).then((b) => setBalance(b / 1000_000_000));
  }, [w.publicKey, conn]);

  return <div className="p-2 rounded-md border">{balance?.toFixed(3)} SOL</div>;
};

export default TreasuryBalance;
