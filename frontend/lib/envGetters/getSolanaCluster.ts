type Cluster = "devnet" | "mainnet";
const getSolanaCluster = (): Cluster => {
  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
  if (!cluster) throw new Error("NEXT_PUBLIC_SOLANA_CLUSTER is not defined");
  if (cluster !== "devnet" && cluster !== "mainnet") {
    throw new Error(
      "NEXT_PUBLIC_SOLANA_CLUSTER shall be set to 'devnet' or 'mainnet'",
    );
  }
  return cluster;
};
export default getSolanaCluster;
