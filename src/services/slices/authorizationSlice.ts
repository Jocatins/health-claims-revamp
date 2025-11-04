import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthorizationParams, Authorization } from '../../types/authorization';
import { fetchAuthorizations, fetchAuthorizationById } from '../thunks/authorizationThunk';


interface AuthorizationState {
  data: Authorization[];
  selectedAuthorization: Authorization | null;
  loading: boolean;
  error: string | null;
  params: AuthorizationParams | null;
}

const initialState: AuthorizationState = {
  data: [],
  selectedAuthorization: null,
  loading: false,
  error: null,
  params: null,
};

const authorizationSlice = createSlice({
  name: 'authorizations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAuthorization: (state) => {
      state.selectedAuthorization = null;
    },
    setParams: (state, action: PayloadAction<AuthorizationParams>) => {
      state.params = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all authorizations
    builder
      .addCase(fetchAuthorizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorizations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAuthorizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch authorizations';
      })
      // Fetch authorization by ID
      .addCase(fetchAuthorizationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorizationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthorization = action.payload;
        state.error = null;
      })
      .addCase(fetchAuthorizationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch authorization';
      });
  },
});

export const { clearError, clearSelectedAuthorization, setParams } = authorizationSlice.actions;
export default authorizationSlice.reducer;