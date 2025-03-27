import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Scholarship
export const createScholarship = createAsyncThunk(
    "scholarship/create",
    async (scholarshipData) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/create`,
                scholarshipData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create scholarship";
        }
    }
);

// Fetch Scholarships
export const fetchScholarships = createAsyncThunk(
    "scholarships/fetch",
    async ({ searchKeyword = "", page = 1, filters = {} }) => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/getall`,
                {
                    params: {
                        searchKeyword,
                        page,
                        ...filters
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch scholarships";
        }
    }
);

const scholarshipSlice = createSlice({
  name: "scholarships",
  initialState: {
    scholarships: [],
    loading: false,         
    error: null,
    message: null,
    scholarship: null,
    currentPage: 1,
    totalPages: 1,
    totalScholarships: 0,
    appliedScholarships: [],
    latestScholarships: [], 
  },
  reducers: {
    requestForAllScholarships(state) {
    state.loading = true;
    state.error = null;
  },
  failureForAllScholarships(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  requestForSingleScholarship(state) {
    state.message = null;
    state.error = null;
    state.loading = true;
  },
  successForSingleScholarship(state, action) {
    state.loading = false;
    state.error = null;
    state.scholarship = action.payload;
  },
  failureForSingleScholarship(state, action) {
    state.scholarship = null;
    state.error = action.payload;
    state.loading = false;
  },
  clearAllErrors(state) {
    state.error = null;
  },
  resetScholarshipSlice(state) {
    state.error = null;
    state.scholarships = [];
    state.loading = false;
    state.message = null;
    state.scholarship = null;
    state.latestScholarships = []; 
  },
  successForAllScholarships(state, action) {
    state.loading = false;
    state.scholarships = action.payload.scholarships;
    state.currentPage = action.payload.currentPage;
    state.totalPages = action.payload.totalPages;
    state.totalScholarships = action.payload.totalScholarships;
  },
  applyScholarshipRequest(state) {
    state.loading = true;
  },
  applyScholarshipSuccess(state, action) {
    state.loading = false;
    if (!state.appliedScholarships.includes(action.payload)) {
      state.appliedScholarships.push(action.payload);
    }
  },
  applyScholarshipFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  setAppliedScholarships(state, action) {
    state.appliedScholarships = action.payload;
  },
  requestLatestScholarships(state) {
    state.loading = true;
    state.error = null;
  },
  successLatestScholarships(state, action) {
    state.loading = false;
    state.error = null;
    state.latestScholarships = action.payload.scholarships;
  },
  failureLatestScholarships(state, action) {
    state.loading = false;
    state.error = action.payload;
    state.latestScholarships = [];
  },
  deleteScholarshipRequest(state) {
    state.loading = true;
    state.error = null;
  },
  deleteScholarshipSuccess(state, action) {
    state.loading = false;
    state.error = null;
    state.scholarships = state.scholarships.filter(scholarship => scholarship._id !== action.payload.id);
  },
  deleteScholarshipFailed(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  updateScholarshipRequest(state) {
    state.loading = true;
    state.error = null;
  },
  updateScholarshipSuccess(state, action) {
    state.loading = false;
    state.error = null;
    state.scholarship = action.payload.scholarship;
  },
  updateScholarshipFailed(state, action) {
    state.loading = false;
    state.error = action.payload;
  }
},
extraReducers: (builder) => {
    builder
        // Create Scholarship
        .addCase(createScholarship.pending, (state) => {
            state.loading = true;
        })
        .addCase(createScholarship.fulfilled, (state, action) => {
            state.loading = false;
            state.scholarships.unshift(action.payload.scholarship);
            state.message = action.payload.message;
        })
        .addCase(createScholarship.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // Fetch Scholarships
        .addCase(fetchScholarships.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchScholarships.fulfilled, (state, action) => {
            state.loading = false;
            state.scholarships = action.payload.scholarships;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalScholarships = action.payload.totalScholarships;
        })
        .addCase(fetchScholarships.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
},
});

export const fetchSingleScholarship = (scholarshipId) => async (dispatch) => {
    dispatch(scholarshipSlice.actions.requestForSingleScholarship());
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/get/${scholarshipId}`, { withCredentials: true });
        dispatch(scholarshipSlice.actions.successForSingleScholarship(response.data.scholarship));
        dispatch(scholarshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(scholarshipSlice.actions.failureForSingleScholarship(error.response.data.message));
    }
};

export const clearAllScholarshipErrors = () => (dispatch) => {
    dispatch(scholarshipSlice.actions.clearAllErrors());
};

export const resetScholarshipSlice = () => (dispatch) => {
    dispatch(scholarshipSlice.actions.resetScholarshipSlice());
};

export const fetchLatestScholarships = () => async (dispatch) => {
  try {
    dispatch(scholarshipSlice.actions.requestLatestScholarships());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/latest`,
      { withCredentials: true }
    );
    dispatch(scholarshipSlice.actions.successLatestScholarships(data));
  } catch (error) {
    dispatch(
      scholarshipSlice.actions.failureLatestScholarships(
        error.response?.data?.message || "Failed to fetch latest scholarships"
      )
    );
  }
};

export const deleteScholarship = (id) => async (dispatch) => {
    try {
        dispatch(scholarshipSlice.actions.deleteScholarshipRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/${id}`, { withCredentials: true });
        dispatch(scholarshipSlice.actions.deleteScholarshipSuccess({ message: response.data.message, id }));
    } catch (error) {
        dispatch(scholarshipSlice.actions.deleteScholarshipFailed(error.response?.data?.message || "Failed to delete scholarship"));
    }
};

export const updateScholarship = (scholarshipId, updatedData) => async (dispatch) => {
  try {
    dispatch(scholarshipSlice.actions.updateScholarshipRequest());
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/scholarship/update/${scholarshipId}`,
      updatedData,
      { withCredentials: true }
    );
    dispatch(scholarshipSlice.actions.updateScholarshipSuccess(response.data));
  } catch (error) {
    dispatch(scholarshipSlice.actions.updateScholarshipFailed(error.response.data.message));
  }
};

export const { clearErrors } = scholarshipSlice.actions;
export default scholarshipSlice.reducer;
