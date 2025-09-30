import { configureStore } from "@reduxjs/toolkit";

import { providerApiSlice } from "../slices/providerSlice";
import authReducer from "../slices/authSlice";
import { toastMiddleware } from "./middleware/toastMiddleware";
import corporateReducer from "../slices/corporateSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    corporate: corporateReducer,

    [providerApiSlice.reducerPath]: providerApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(providerApiSlice.middleware)
      .concat(toastMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
