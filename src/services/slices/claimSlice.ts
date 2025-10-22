import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Claim } from '../../types/claims';
import { createClaim, fetchClaimById, fetchClaims } from '../thunks/claimsThunk';

interface ClaimsState {
  claims: Claim[];
  selectedClaim: Claim | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

const initialState: ClaimsState = {
  claims: [],
  selectedClaim: null,
  loading: false,
  error: null,
  success: false,
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedClaim: (state, action: PayloadAction<Claim | null>) => {
      state.selectedClaim = action.payload;
    },
    clearClaims: (state) => {
      state.claims = [];
      state.selectedClaim = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Claims
    builder
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchClaims.fulfilled, (state, action: PayloadAction<Claim[]>)=> {
        state.loading = false;
        state.claims = action.payload;
        state.success = true; 
        state.totalCount = action.payload.length;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch claims';
        state.success = false;
      });

    // Create Claim
    builder
      .addCase(createClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
        state.loading = false;
        state.claims.push(action.payload);
        state.success = true;
      })
      .addCase(createClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create claim';
        state.success = false;
      });

    // Fetch Claim by ID
    builder
      .addCase(fetchClaimById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimById.fulfilled, (state, action: PayloadAction<Claim>) => {
        state.loading = false;
        state.selectedClaim = action.payload;
        state.success = true;
      })
      .addCase(fetchClaimById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch claim';
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, setSelectedClaim, clearClaims } = claimsSlice.actions;
export default claimsSlice.reducer;