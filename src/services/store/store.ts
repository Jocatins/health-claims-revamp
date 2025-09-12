import { configureStore } from "@reduxjs/toolkit";
import { productApiSlice } from "../slices/productsSlice";
import { providerApiSlice } from "../slices/providerSlice";
import authReducer from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  [productApiSlice.reducerPath]: productApiSlice.reducer,
  [providerApiSlice.reducerPath]: providerApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
  productApiSlice.middleware,
  providerApiSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
