// store.js
import { configureStore } from "@reduxjs/toolkit";
import fundedProposalSlice from "./fundedProposalSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    fundedProposal: fundedProposalSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
