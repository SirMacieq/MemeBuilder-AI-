import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { OnChainProposalBase } from "@/lib/net-api/chain";
import type { RootState } from "./store";

export interface CounterState {
  value: OnChainProposalBase[];
}

const initialState: CounterState = {
  value: [],
};

export const fundedProposalSlice = createSlice({
  name: "fundedProposal",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<OnChainProposalBase[]>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setValue } = fundedProposalSlice.actions;
export const selectFundedProposal = (state: RootState) =>
  state.fundedProposal.value;
export default fundedProposalSlice.reducer;
