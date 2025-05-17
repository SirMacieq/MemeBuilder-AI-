"use client";
import dynamic from "next/dynamic";

const NossrWalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

const Login = () => {
  return (
    <div className="grow flex flex-col items-center justify-center bg-[#010613]">
      <div
        className="flex flex-col items-center justify-center gap-4 bg-[#0e131f] p-4"
        suppressHydrationWarning
      >
        <h2 className="text-3xl">Login</h2>
        <p>Login with your solana compatible wallet</p>
        <NossrWalletMultiButton style={{ borderRadius: "10px" }} />
      </div>
    </div>
  );
};

export default Login;
