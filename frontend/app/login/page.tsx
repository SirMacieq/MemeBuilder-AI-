"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Login = () => {
  return (
    <div className="grow flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 bg-neutral-300 p-4">
        <h2 className="text-3xl">Login</h2>
        <p>Login with your solana compatible wallet</p>
        <WalletMultiButton style={{ borderRadius: "10px" }} />
      </div>
    </div>
  );
};

export default Login;
