import { configureStore } from "@reduxjs/toolkit";

import { providerApiSlice } from "../slices/providerSlice";
import authReducer from "../slices/authSlice";
import { toastMiddleware } from "./middleware/toastMiddleware";
import corporateReducer from "../slices/corporateSlice"
import { enrolleeClassReducer, enrolleeTypeReducer, genderReducer, maritalStatusReducer, planTypeReducer, relationshipReducer } from "../slices/resourceSlice";
import claimsReducer from "../slices/claimSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    corporate: corporateReducer,
    gender: genderReducer,
    maritalStatus: maritalStatusReducer,
    relations: relationshipReducer,
    enrolleeType: enrolleeTypeReducer,
    planType: planTypeReducer,
    enrolleeClass: enrolleeClassReducer,
    claims: claimsReducer,
    [providerApiSlice.reducerPath]: providerApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(providerApiSlice.middleware)
      .concat(toastMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
