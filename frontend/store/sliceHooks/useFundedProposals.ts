import { getAllTokenProposals } from "@/lib/net-api/chain";
import { useAppSelector, useAppDispatch } from "../hooks";
import { useState, useEffect, useCallback } from "react";
import { setValue, selectFundedProposal } from "../fundedProposalSlice";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const useFundedProposals = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const proposals = useAppSelector(selectFundedProposal);
  const wallet = useAnchorWallet();

  const refresh = useCallback(async () => {
    if (!wallet) throw "Cannot refresh, wallet not connected";
    try {
      setLoading(true);
      const proposals = await getAllTokenProposals(wallet);
      dispatch(setValue(proposals));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(e.toString());
      throw e;
    }
  }, [dispatch, wallet]);
  useEffect(() => {
    if (!wallet) return;
    if (proposals.length > 0) return;
    refresh();
  }, [refresh, dispatch, wallet, proposals.length]);

  return { loading, proposals, error, refresh };
};
export default useFundedProposals;
