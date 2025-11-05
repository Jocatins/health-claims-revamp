import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Claim } from '../../types/claims';
import { fetchNemsasClaims, fetchNemsasClaimsByPatient } from '../thunks/nemsasThunk';

interface NemsasState {
  claims: Claim[];
  loading: boolean;
  error: string | null;
}

const initialState: NemsasState = {
  claims: [],
  loading: false,
  error: null,
};

const nemsasSlice = createSlice({
  name: 'nemsas',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearClaims: (state) => {
      state.claims = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNemsasClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNemsasClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
        state.loading = false;
        state.claims = action.payload;
        state.error = null;
      })
      .addCase(fetchNemsasClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch NEMSAS claims';
      })
      // Patient-specific fetch
      .addCase(fetchNemsasClaimsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNemsasClaimsByPatient.fulfilled, (state, action: PayloadAction<Claim[]>) => {
        state.loading = false;
        state.claims = action.payload;
        state.error = null;
      })
      .addCase(fetchNemsasClaimsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient claims';
      });
  },
});

export const { clearError, clearClaims } = nemsasSlice.actions;
export default nemsasSlice.reducer;