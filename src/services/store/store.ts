import { configureStore } from "@reduxjs/toolkit";
import { productApiSlice } from "../slices/productsSlice";
import authReducer from '../slices/authSlice';
import { toastMiddleware } from "./middleware/toastMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApiSlice.reducerPath]: productApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApiSlice.middleware).concat(toastMiddleware()),
 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
