import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { getOneUser } from "@/lib/net-api/chain";

export interface UserState {
  value: Awaited<ReturnType<typeof getOneUser>> | null;
}

const initialState: UserState = {
  value: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<UserState["value"]>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setValue } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.value;
export default userSlice.reducer;
