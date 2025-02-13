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
    appliedJobs: [],
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
    state.internships;
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
    state.pagination = action.payload.pagination;
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
    state.internships = state.internships.filter(internship => internship._id !== action.payload.id);
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
        // Create Internship
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
},
});

export const fetchInternships = (city = "All", internship_type = "All", searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(internshipSlice.actions.requestForAllInternships());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/getall?`;
        let queryParams = [`page=${page}`];
    
        if (city && city !== "All") {
            queryParams.push(`city=${encodeURIComponent(city)}`);
        }
        
        if (internship_type && internship_type !== "All") {
            queryParams.push(`internship_type=${encodeURIComponent(internship_type)}`);
        }
        
        if (searchKeyword) {
            queryParams.push(`searchKeyword=${encodeURIComponent(searchKeyword)}`);
        }
    
        link += queryParams.join("&");
        
        const response = await axios.get(link, { withCredentials: true });
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch internships");
        }
        
        dispatch(internshipSlice.actions.successForAllInternships({
            internships: response.data.internships,
            pagination: response.data.pagination
        }));
        dispatch(internshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(internshipSlice.actions.failureForAllInternships(
            error.response?.data?.message || error.message || "Failed to fetch internships"
        ));
    }
};

export const fetchInternship_old = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(internshipSlice.actions.requestForAllInternships());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/getall?`;
        let queryParams = [`page=${page}`];
    
        if (searchKeyword) {
            queryParams.push(`searchKeyword=${encodeURIComponent(searchKeyword)}`);
        }
    
        link += queryParams.join("&");
        const response = await axios.get(link, { withCredentials: true });
        
        dispatch(internshipSlice.actions.successForAllInternships({
            internships: response.data.internships,
            pagination: response.data.pagination
        }));
        dispatch(internshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(internshipSlice.actions.failureForAllInternships(error.response?.data?.message || "Failed to fetch internships"));
    }
};

export const fetchSingleInternship = (internshipId) => async (dispatch) => {
    dispatch(internshipSlice.actions.requestForSingleInternship());
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/get/${internshipId}`, { withCredentials: true });
        dispatch(internshipSlice.actions.successForSingleInternship(response.data.internship));
        dispatch(internshipSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(internshipSlice.actions.failureForSingleInternship(error.response.data.message));
    }
};

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
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/internship/${id}`, { withCredentials: true });
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
