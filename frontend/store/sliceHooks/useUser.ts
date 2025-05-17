import { getOneUser, getUserPDA } from "@/lib/net-api/chain";
import { useAppSelector, useAppDispatch } from "../hooks";
import { useState, useEffect, useCallback } from "react";
import { setValue, selectUser } from "../userSlice";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const useUser = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const wallet = useAnchorWallet();

  const refresh = useCallback(async () => {
    if (!wallet) throw "Cannot refresh, wallet not connected";
    try {
      setLoading(true);
      const userPda = await getUserPDA(wallet);
      const user = await getOneUser(wallet, userPda.toBase58());
      dispatch(setValue(user));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      //@ts-ignore
      setError(e.toString());
      throw e;
    }
  }, [dispatch, wallet]);
  useEffect(() => {
    if (!wallet) return;
    if (user !== null) return;
    refresh();
  }, [refresh, dispatch, wallet, user]);

  return { loading, user, error, refresh };
};
export default useUser;
