import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Internship
export const createInternship = createAsyncThunk(
  "internship/create",
  async (internshipData) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/create`,
        internshipData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

export const createAiInternship = createAsyncThunk(
    "internship/createAi",
    async (internshipData) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/process`,
                { internshipDetails: internshipData },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create AI internship";
        }
    }
);

const internshipSlice = createSlice({
  name: "internships",
  initialState: {
    internships: [],
    loading: false,
    error: null,
    message: null,
    internship: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalInternships: 0,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      limit: 8
    },
    appliedInternships: [], // Fixed typo from appliedJobs
    latestInternships: [],
  },
  reducers: {
    requestForAllInternships(state) {
      state.loading = true;
      state.error = null;
    },
    failureForAllInternships(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleInternship(state) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleInternship(state, action) {
      state.loading = false;
      state.error = null;
      state.internship = action.payload;
    },
    failureForSingleInternship(state, action) {
      state.internship = null;
      state.error = action.payload;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    resetInternshipSlice(state) {
      state.error = null;
      state.internships = [];
      state.loading = false;
      state.message = null;
      state.internship = null;
      state.latestInternships = [];
    },
    successForAllInternships(state, action) {
      state.loading = false;
      state.internships = action.payload.internships;
      state.pagination = {
        ...state.pagination,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalInternships: action.payload.totalInternships,
        hasNextPage: action.payload.currentPage < action.payload.totalPages,
        hasPrevPage: action.payload.currentPage > 1,
        nextPage: action.payload.currentPage < action.payload.totalPages 
          ? action.payload.currentPage + 1 
          : null,
        prevPage: action.payload.currentPage > 1 
          ? action.payload.currentPage - 1 
          : null
      };
    },
    applyInternshipRequest(state) {
      state.loading = true;
    },
    applyInternshipSuccess(state, action) {
      state.loading = false;
      if (!state.appliedInternships.includes(action.payload)) {
        state.appliedInternships.push(action.payload);
      }
    },
    applyInternshipFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setAppliedInternships(state, action) {
      state.appliedInternships = action.payload;
    },
    requestLatestInternships(state) {
      state.loading = true;
      state.error = null;
    },
    successLatestInternships(state, action) {
      state.loading = false;
      state.error = null;
      state.latestInternships = action.payload.internships || [];
    },
    failureLatestInternships(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.latestInternships = [];
    },
    deleteInternshipRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteInternshipSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.internships = state.internships.filter(
        internship => internship._id !== action.payload.id
      );
    },
    deleteInternshipFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateInternshipRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateInternshipSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.internship = action.payload;
      state.message = "Internship updated successfully";
    },
    updateInternshipFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInternship.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInternship.fulfilled, (state, action) => {
        state.loading = false;
        state.internships.unshift(action.payload.internship);
        state.message = action.payload.message;
      })
      .addCase(createInternship.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

      builder
            // Create AI Internship
            .addCase(createAiInternship.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAiInternship.fulfilled, (state, action) => {
                state.loading = false;
                state.internships.unshift(action.payload.internship);
                state.message = action.payload.message;
            })
            .addCase(createAiInternship.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
  },
});

// Updated fetchInternships to handle pagination correctly
// Updated Redux slice (internshipSlice.js)
export const fetchInternships = (params) => async (dispatch) => {
  try {
    const { 
      city = "All", 
      internship_type = "All", 
      searchKeyword = "", 
      page = 1, 
      limit = 8 
    } = params;

    dispatch(internshipSlice.actions.requestForAllInternships());
    let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/getall?page=${page}&limit=${limit}`;
    
    if (city && city !== "All") {
      link += `&city=${encodeURIComponent(city)}`;
    }
    
    if (internship_type && internship_type !== "All") {
      link += `&internship_type=${encodeURIComponent(internship_type)}`;
    }
    
    if (searchKeyword) {
      link += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }

    const response = await axios.get(link, { withCredentials: true });
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch internships");
    }
    
    dispatch(internshipSlice.actions.successForAllInternships({
      internships: response.data.internships,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
      totalInternships: response.data.totalInternships
    }));
    
    dispatch(internshipSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(internshipSlice.actions.failureForAllInternships(
      error.response?.data?.message || error.message || "Failed to fetch internships"
    ));
  }
};

export const fetchSingleInternship = (internshipId) => async (dispatch) => {
  dispatch(internshipSlice.actions.requestForSingleInternship());
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/get/${internshipId}`,
      { withCredentials: true }
    );
    dispatch(internshipSlice.actions.successForSingleInternship(response.data.internship));
    dispatch(internshipSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(internshipSlice.actions.failureForSingleInternship(error.response.data.message));
  }
};

// Other actions remain the same as in your original code...
export const clearAllInternshipErrors = () => (dispatch) => {
    dispatch(internshipSlice.actions.clearAllErrors());
};

export const resetInternshipSlice = () => (dispatch) => {
    dispatch(internshipSlice.actions.resetInternshipSlice());
};

export const fetchLatestInternships = () => async (dispatch) => {
  try {
    dispatch(internshipSlice.actions.requestLatestInternships());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/latest`
    );
    dispatch(internshipSlice.actions.successLatestInternships(data));
  } catch (error) {
    dispatch(
      internshipSlice.actions.failureLatestInternships(
        error.response?.data?.message || "Failed to fetch latest internships"
      )
    );
  }
};

export const deleteInternship = (id) => async (dispatch) => {
  try {
    dispatch(internshipSlice.actions.deleteInternshipRequest());
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/delete/${id}`, { withCredentials: true });
    dispatch(internshipSlice.actions.deleteInternshipSuccess({ message: response.data.message, id }));
  } catch (error) {
    dispatch(internshipSlice.actions.deleteInternshipFailed(error.response?.data?.message || "Failed to delete internship"));
  }
};

export const updateInternship = ({ internshipId, updatedData }) => async (dispatch) => {
  try {
    dispatch(internshipSlice.actions.updateInternshipRequest());
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/update/${internshipId}`,
      updatedData,
      { withCredentials: true }
    );
    dispatch(internshipSlice.actions.updateInternshipSuccess(data.internship));
    return data;
  } catch (error) {
    dispatch(internshipSlice.actions.updateInternshipFailure(error.response?.data?.message || "Failed to update internship"));
  }
};

export const { clearError, clearMessage } = internshipSlice.actions;
export default internshipSlice.reducer;
