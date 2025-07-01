import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const govtJobSlice = createSlice({
  name: "govtJobs",
  initialState: {
    govtJobs: [],
    loading: false,
    error: null,
    message: null,
    job: null,
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    latestGovtJobs: [],
  },
  reducers: {
    // Loading and Error Handling
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
      state.message = null;
    },

    // Job CRUD Operations
    createJobSuccess(state, action) {
      state.loading = false;
      state.govtJobs.unshift(action.payload);
      state.message = "Job created successfully";
    },
    getJobsSuccess(state, action) {
      state.loading = false;
      state.govtJobs = action.payload.govtJobs;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalJobs = action.payload.totalJobs;
    },
    getSingleJobSuccess(state, action) {
      state.loading = false;
      state.job = action.payload;
    },
    updateJobSuccess(state, action) {
      state.loading = false;
      state.govtJobs = state.govtJobs.map(job => 
        job._id === action.payload._id ? action.payload : job
      );
      state.message = "Job updated successfully";
    },
    deleteJobSuccess(state, action) {
      state.loading = false;
      state.govtJobs = state.govtJobs.filter(
        job => job._id !== action.payload
      );
      state.message = "Job deleted successfully";
    },

    // Latest Jobs
    getLatestJobsSuccess(state, action) {
      state.loading = false;
      state.latestGovtJobs = action.payload;
    },

    // Reset State
    resetJobState(state) {
      Object.assign(state, {
        govtJobs: [],
        loading: false,
        error: null,
        message: null,
        job: null,
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
        latestGovtJobs: [],
      });
    }
  },
  extraReducers: (builder) => {
    builder
                // Create AI Govt Job
                .addCase(createAiGovtJob.pending, (state) => {
                    state.loading = true;
                })
                .addCase(createAiGovtJob.fulfilled, (state, action) => {
                    state.loading = false;
                    state.govtJobs.unshift(action.payload.govtJob);
                    state.message = action.payload.message;
                })
                .addCase(createAiGovtJob.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });
  }
});

// Async Actions
export const {
  startLoading,
  setError,
  clearErrors,
  createJobSuccess,
  getJobsSuccess,
  getSingleJobSuccess,
  updateJobSuccess,
  deleteJobSuccess,
  getLatestJobsSuccess,
  resetJobState
} = govtJobSlice.actions;

export const createGovtJob = (jobData) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/create`,
      jobData,
      { withCredentials: true }
    );
    dispatch(createJobSuccess(data.govtJob));
    return { success: true, data: data.govtJob };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Job creation failed'));
    return { success: false, error: error.response?.data?.message };
  }
};

export const createAiGovtJob = createAsyncThunk(
    "govtJob/createAi",
    async (govtJobData) => {
        try {
            const { data } = await axios.post(
                `https://backend-exameets-production.up.railway.app/api/v1/govtjob/process`,
                { govtJobDetails: govtJobData },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create AI govt job";
        }
    }
);

export const fetchGovtJobs = (params = {}) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/getall`,
      { params, withCredentials: true }
    );
    dispatch(getJobsSuccess(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const fetchSingleGovtJob = (jobId) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/get/${jobId}`,
      { withCredentials: true }
    );
    dispatch(getSingleJobSuccess(data.job));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Job not found'));
  }
};

export const updateGovtJob = createAsyncThunk(
  'govtJobs/updateJob',
  async (payload, { rejectWithValue }) => {
    try {
      const { jobId, updatedData } = payload;
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/update/${jobId}`,
        updatedData,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 
        error.message || 
        error.toString() || 
        'An error occurred while updating the job';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteGovtJob = (jobId) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/${jobId}`,
      { withCredentials: true }
    );
    dispatch(deleteJobSuccess(jobId));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Delete failed'));
    return { success: false };
  }
};

export const fetchLatestGovtJobs = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/latest`,
      { withCredentials: true }
    );
    dispatch(getLatestJobsSuccess(data.govtJobs));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch latest jobs'));
  }
};

export default govtJobSlice.reducer;