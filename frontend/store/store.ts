// store.js
import { configureStore } from "@reduxjs/toolkit";
import fundedProposalSlice from "./fundedProposalSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    fundedProposal: fundedProposalSlice,
    user: userSlice,
  },
  // FIX: handle serializability of BN objects
  // this is there to prevent redux from throwing errors when we give it objects from the solana rpc
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
