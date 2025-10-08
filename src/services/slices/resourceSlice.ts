import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
    fetchEnrolleeClass,
    fetchEnrolleeType,
    fetchGenders,
    fetchMaritalStatuses,
    fetchPlanTypes,
    fetchRelationships,
} from "../thunks/resourcesThunk";
import type {
    EnrolleeClassState,
    EnrolleeTypeState,
    GenderState,
    IEnrolleeClass,
    IEnrolleeType,
    IPlanType,
    MaritalStatusState,
    PlanTypeState,
    RelationshipState,
} from "../../types/resources";

// Gender Slice

const initialGenderState: GenderState = {
    data: [],
    loading: false,
    error: null,
    message: "",
    isSuccess: false,
};

export const genderSlice = createSlice({
    name: "gender",
    initialState: initialGenderState,
    reducers: {
        clearGenderError: (state) => {
            state.error = null;
        },
        resetGenderState: () => initialGenderState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchGenders.fulfilled,
                (state, action: PayloadAction<string[]>) => {
                    state.loading = false;
                    state.data = action.payload;
                    state.isSuccess = true;
                    state.message = "Genders fetched successfully";
                }
            )
            .addCase(fetchGenders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch genders";
                state.isSuccess = false;
                state.message = "Failed to fetch genders";
            });
    },
});

// Marital Status Slice

const initialMaritalStatusState: MaritalStatusState = {
    data: [],
    loading: false,
    error: null,
    message: "",
    isSuccess: false,
};

export const maritalStatusSlice = createSlice({
    name: "maritalStatus",
    initialState: initialMaritalStatusState,
    reducers: {
        clearMaritalStatusError: (state) => {
            state.error = null;
        },
        resetMaritalStatusState: () => initialMaritalStatusState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaritalStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchMaritalStatuses.fulfilled,
                (state, action: PayloadAction<string[]>) => {
                    state.loading = false;
                    state.data = action.payload;
                    state.isSuccess = true;
                    state.message = "Marital statuses fetched successfully";
                }
            )
            .addCase(fetchMaritalStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch marital statuses";
                state.isSuccess = false;
                state.message = "Failed to fetch marital statuses";
            });
    },
});

// Relationship Slice

const initialRelationshipState: RelationshipState = {
    data: [],
    loading: false,
    error: null,
    message: "",
    isSuccess: false,
};

export const relationshipSlice = createSlice({
    name: "relationship",
    initialState: initialRelationshipState,
    reducers: {
        clearRelationshipError: (state) => {
            state.error = null;
        },
        resetRelationshipState: () => initialRelationshipState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRelationships.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchRelationships.fulfilled,
                (state, action: PayloadAction<string[]>) => {
                    state.loading = false;
                    state.data = action.payload;
                    state.isSuccess = true;
                    state.message = "Relationships fetched successfully";
                }
            )
            .addCase(fetchRelationships.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch relationships";
                state.isSuccess = false;
                state.message = "Failed to fetch relationships";
            });
    },
});

// Enrollee Type Slice

const initialEnrolleeTypeState: EnrolleeTypeState = {
    data: [],
    loading: false,
    error: null,
    message: '',
    isSuccess: false,
};

export const enrolleeTypeSlice = createSlice({
    name: 'enrolleeType',
    initialState: initialEnrolleeTypeState,
    reducers: {
        clearEnrolleeTypeError: (state) => {
            state.error = null;
        },
        resetEnrolleeTypeState: () => initialEnrolleeTypeState,
        updateEnrolleeType: (state, action: PayloadAction<IEnrolleeType>) => {
            const index = state.data.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        },
        toggleEnrolleeTypeStatus: (state, action: PayloadAction<string>) => {
            const enrolleeType = state.data.find(item => item.id === action.payload);
            if (enrolleeType) {
                enrolleeType.isActive = !enrolleeType.isActive;
            }
        },
        addEnrolleeType: (state, action: PayloadAction<IEnrolleeType>) => {
            state.data.push(action.payload);
        },
        removeEnrolleeType: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(item => item.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnrolleeType.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(fetchEnrolleeType.fulfilled, (state, action: PayloadAction<IEnrolleeType[]>) => {
                state.loading = false;
                state.data = action.payload;
                state.isSuccess = true;
                state.message = 'Enrollee types fetched successfully';
                state.error = null;
            })
            .addCase(fetchEnrolleeType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch enrollee types';
                state.isSuccess = false;
                state.message = 'Failed to fetch enrollee types';
                state.data = [];
            });
    },
});

// Enrollee Class Slice
const intialEnrolleeClassState: EnrolleeClassState = {
     data: [],
    loading: false,
    error: null,
    message: '',
    isSuccess: false,
}

export const enrolleeClassSlice = createSlice({
    name: 'enrolleeType',
    initialState: intialEnrolleeClassState,
    reducers: {
        clearEnrolleeClassError: (state) => {
            state.error = null;
        },
        resetEnrolleeClassState: () => intialEnrolleeClassState,
        updateEnrolleeClass: (state, action: PayloadAction<IEnrolleeClass>) => {
            const index = state.data.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        },
        toggleEnrolleeClassStatus: (state, action: PayloadAction<string>) => {
            const enrolleeClass = state.data.find(item => item.id === action.payload);
            if (enrolleeClass) {
                enrolleeClass.isActive = !enrolleeClass.isActive;
            }
        },
        addEnrolleeClass: (state, action: PayloadAction<IEnrolleeClass>) => {
            state.data.push(action.payload);
        },
        removeEnrolleeClass: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(item => item.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnrolleeClass.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(fetchEnrolleeClass.fulfilled, (state, action: PayloadAction<IEnrolleeClass[]>) => {
                state.loading = false;
                state.data = action.payload;
                state.isSuccess = true;
                state.message = 'Enrollee class fetched successfully';
                state.error = null;
            })
            .addCase(fetchEnrolleeClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch enrollee class';
                state.isSuccess = false;
                state.message = 'Failed to fetch enrollee class';
                state.data = [];
            });
    },
});

// Plan Type Slice

const initialPlanTypeState: PlanTypeState = {
  data: [],
  loading: false,
  error: null,
  message: '',
  isSuccess: false,
};

export const planTypeSlice = createSlice({
  name: 'planType',
  initialState: initialPlanTypeState,
  reducers: {
    clearPlanTypeError: (state) => {
      state.error = null;
    },
    resetPlanTypeState: () => initialPlanTypeState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(fetchPlanTypes.fulfilled, (state, action: PayloadAction<IPlanType[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.isSuccess = true;
        state.message = 'Plan types fetched successfully';
        state.error = null;
      })
      .addCase(fetchPlanTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plan types';
        state.isSuccess = false;
        state.message = 'Failed to fetch plan types';
        state.data = [];
      });
  },
});


// Export actions
export const { clearGenderError, resetGenderState } = genderSlice.actions;
export const { clearMaritalStatusError, resetMaritalStatusState } = maritalStatusSlice.actions;
export const { clearRelationshipError, resetRelationshipState } = relationshipSlice.actions;
export const { clearEnrolleeTypeError, resetEnrolleeTypeState } = enrolleeTypeSlice.actions;
export const { clearEnrolleeClassError, resetEnrolleeClassState } = enrolleeClassSlice.actions;
export const { clearPlanTypeError, resetPlanTypeState } = planTypeSlice.actions;


// Export reducers
export const genderReducer = genderSlice.reducer;
export const maritalStatusReducer = maritalStatusSlice.reducer;
export const relationshipReducer = relationshipSlice.reducer;
export const enrolleeTypeReducer = enrolleeTypeSlice.reducer;
export const enrolleeClassReducer = enrolleeClassSlice.reducer;
export const planTypeReducer = planTypeSlice.reducer;

