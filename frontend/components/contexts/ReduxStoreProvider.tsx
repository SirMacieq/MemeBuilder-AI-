"use client";
import { store } from "@/store/store";
import { Provider } from "react-redux";

import React from "react";

const ReduxStoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStoreProvider;
