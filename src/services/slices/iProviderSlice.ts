import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProviderState, ProviderEntity } from '../../types/iProvider';
import { createProvider, fetchProviders, fetchProviderById, updateProvider } from '../thunks/iProviderThunk';

const initialState: ProviderState = {
  providers: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
};

const providerSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearProviders: (state) => {
      state.providers = [];
    },
    updateProviderLocal: (state, action: PayloadAction<ProviderEntity>) => {
      const index = state.providers.findIndex(provider => provider.id === action.payload.id);
      if (index !== -1) {
        state.providers[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Providers
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action: PayloadAction<ProviderEntity[]>) => {
        state.loading = false;
        state.providers = action.payload;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch providers';
      })

    // Create Provider
    .addCase(createProvider.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createProvider.fulfilled, (state, action: PayloadAction<ProviderEntity>) => {
        state.creating = false;
        state.providers.push(action.payload);
        state.createError = null;
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.error.message || 'Failed to create provider';
      })

    // Fetch Provider by ID
    .addCase(fetchProviderById.fulfilled, (state, action: PayloadAction<ProviderEntity>) => {
        const existingIndex = state.providers.findIndex(provider => provider.id === action.payload.id);
        if (existingIndex === -1) {
          state.providers.push(action.payload);
        } else {
          state.providers[existingIndex] = action.payload;
        }
      })

    // Update Provider
    .addCase(updateProvider.fulfilled, (state, action: PayloadAction<ProviderEntity>) => {
        const index = state.providers.findIndex(provider => provider.id === action.payload.id);
        if (index !== -1) {
          state.providers[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearProviders, updateProviderLocal } = providerSlice.actions;
export default providerSlice.reducer;