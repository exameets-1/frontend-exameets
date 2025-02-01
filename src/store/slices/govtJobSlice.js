import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
    appliedJobs: [],
    latestGovtJobs: [],
  },
  reducers: {
    requestForAllJobs(state) {
      state.loading = true;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleJob(state) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.job = action.payload;
    },
    failureForSingleJob(state, action) {
      state.job = null;
      state.error = action.payload;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
      state.govtJobs;
    },
    resetJobSlice(state) {
      state.error = null;
      state.govtJobs = [];
      state.loading = false;
      state.message = null;
      state.job = null;
      state.latestGovtJobs = [];
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.govtJobs = action.payload.govtJobs;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalJobs = action.payload.totalJobs;
    },
    applyJobRequest(state) {
      state.loading = true;
    },
    applyJobSuccess(state, action) {
      state.loading = false;
      if (!state.appliedJobs.includes(action.payload)) {
        state.appliedJobs.push(action.payload);
      }
    },
    applyJobFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setAppliedJobs(state, action) {
      state.appliedJobs = action.payload;
    },
    requestLatestGovtJobs(state) {
      state.loading = true;
      state.error = null;
    },
    successLatestGovtJobs(state, action) {
      state.loading = false;
      state.error = null;
      state.latestGovtJobs = action.payload.govtJobs;
    },
    failureLatestGovtJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.latestGovtJobs = [];
    },
    deleteGovtJobRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteGovtJobSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.govtJobs = state.govtJobs.filter(job => job._id !== action.payload.jobId);
    },
    deleteGovtJobFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateGovtJobRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateGovtJobSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.job = action.payload;
      state.message = "Job updated successfully";
    },
    updateGovtJobFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createGovtJobRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createGovtJobSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.govtJobs.unshift(action.payload.govtJob);
    },
    createGovtJobFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchGovtJobs = (city, job_type, searchKeyword = "", page = 1) => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.requestForAllJobs());

    let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/getall?`;
    let queryParams = [`page=${page}`];

    if (searchKeyword) {
      queryParams.push(`searchKeyword=${encodeURIComponent(searchKeyword)}`);
    }
    if (city && city !== "All") {
      queryParams.push(`city=${encodeURIComponent(city)}`);
    }
    if (job_type && job_type !== "All") {
      queryParams.push(`job_type=${encodeURIComponent(job_type)}`);
    }

    link += queryParams.join("&");
    const response = await axios.get(link, { withCredentials: true });
    dispatch(govtJobSlice.actions.successForAllJobs(response.data));
    dispatch(govtJobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(govtJobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch government jobs"));
  }
};

export const fetchSingleGovtJob = (jobId) => async (dispatch) => {
  dispatch(govtJobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/get/${jobId}`, { withCredentials: true });
    dispatch(govtJobSlice.actions.successForSingleJob(response.data.job));
    dispatch(govtJobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(govtJobSlice.actions.failureForSingleJob(error.response.data.message));
  }
};

export const clearAllGovtJobErrors = () => (dispatch) => {
  dispatch(govtJobSlice.actions.clearAllErrors());
};

export const resetGovtJobSlice = () => (dispatch) => {
  dispatch(govtJobSlice.actions.resetJobSlice());
};

export const fetchLatestGovtJobs = () => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.requestLatestGovtJobs());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/latest`,
      { withCredentials: true }
    );
    dispatch(govtJobSlice.actions.successLatestGovtJobs(data));
  } catch (error) {
    dispatch(
      govtJobSlice.actions.failureLatestGovtJobs(
        error.response?.data?.message || "Failed to fetch latest government jobs"
      )
    );
  }
};

export const deleteGovtJob = (jobId) => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.deleteGovtJobRequest());
    const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/${jobId}`, { withCredentials: true });
    dispatch(govtJobSlice.actions.deleteGovtJobSuccess({ message: data.message, jobId }));
  } catch (error) {
    dispatch(govtJobSlice.actions.deleteGovtJobFailure(error.response?.data?.message || "Failed to delete government job"));
    toast.error(error.response?.data?.message || "Failed to delete government job");
  }
};

export const updateGovtJob = ({ jobId, updatedData }) => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.updateGovtJobRequest());
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/update/${jobId}`,
      updatedData,
      { withCredentials: true }
    );
    dispatch(govtJobSlice.actions.updateGovtJobSuccess(data.job));
    return data;
  } catch (error) {
    dispatch(govtJobSlice.actions.updateGovtJobFailure(error.response?.data?.message || "Failed to update job"));
  }
};

export const createGovtJob = (jobData) => async (dispatch) => {
  try {
    dispatch(govtJobSlice.actions.createGovtJobRequest());
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/govtjob/create`, jobData, { withCredentials: true });
    dispatch(govtJobSlice.actions.createGovtJobSuccess(response.data));
    return { success: true };
  } catch (error) {
    dispatch(govtJobSlice.actions.createGovtJobFailed(
      error.response?.data?.message || 'Error creating government job'
    ));
    return { success: false, error: error.response?.data?.message };
  }
};

export const { clearErrors } = govtJobSlice.actions;
export default govtJobSlice.reducer;
