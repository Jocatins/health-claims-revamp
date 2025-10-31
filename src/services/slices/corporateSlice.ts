
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createCorporate, fetchCorporateEntities } from "../thunks/corporateThunk";
import type { CorporateEntity } from "../../types/iCorporate"; 

interface CorporateState {
  corporates: CorporateEntity[];
  selectedCorporate: CorporateEntity | null; 
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: CorporateState = {
  corporates: [],
  selectedCorporate: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

const corporateSlice = createSlice({
  name: "corporate",
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    setSelectedCorporate: (state, action: PayloadAction<CorporateEntity | null>) => {
      state.selectedCorporate = action.payload;
    },
    addCorporate: (state, action: PayloadAction<CorporateEntity>) => {
      state.corporates.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCorporate.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createCorporate.fulfilled, (state, action: PayloadAction<CorporateEntity>) => {
        state.createLoading = false;
        state.corporates.push(action.payload); 
      })
      .addCase(createCorporate.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.error.message || "Failed to create corporate";
      })
      // Fetch Corporates
      .addCase(fetchCorporateEntities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCorporateEntities.fulfilled, (state, action: PayloadAction<CorporateEntity[]>) => {
        state.loading = false;
        state.corporates = action.payload;
      })
      .addCase(fetchCorporateEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch corporates";
      });
  },
});

export const { clearCreateError, setSelectedCorporate, addCorporate } = corporateSlice.actions;
export default corporateSlice.reducer;