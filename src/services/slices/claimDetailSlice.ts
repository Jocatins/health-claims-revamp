
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClaimDetailsState, ClaimItem } from '../../types/claims';
import { fetchClaimById } from '../thunks/claimsThunk';

const initialState: ClaimDetailsState = {
  claimItems: [],
  loading: false,
  error: null,
};

const claimDetailsSlice = createSlice({
  name: 'claimDetails',
  initialState,
  reducers: {
    clearClaimDetails: (state) => {
      state.claimItems = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaimById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimById.fulfilled, (state, action: PayloadAction<ClaimItem[]>) => {
        state.loading = false;
        state.claimItems = action.payload;
        state.error = null;
      })
      .addCase(fetchClaimById.rejected, (state, action) => {
        state.loading = false;
        state.claimItems = [];
        state.error = action.error.message || 'Failed to fetch claim details';
      });
  },
});

export const { clearClaimDetails, clearError } = claimDetailsSlice.actions;
export default claimDetailsSlice.reducer;