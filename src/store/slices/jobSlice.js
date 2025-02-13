import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    appliedJobs: [],
    latestJobs: [],
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
      state.singleJob = action.payload;
    },
    failureForSingleJob(state, action) {
      state.singleJob;
      state.error = action.payload;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
      state.jobs;
    },
    resetJobSlice(state) {
      state.error = null;
      state.jobs;
      state.loading = false;
      state.message = null;
      state.singleJob = {};
      state.latestJobs = [];
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload.jobs;
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
    requestLatestJobs(state) {
      state.loading = true;
      state.error = null;
    },
    successLatestJobs(state, action) {
      state.loading = false;
      state.error = null;
      state.latestJobs = action.payload.jobs;
    },
    failureLatestJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.latestJobs = [];
    },
    deleteJobRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteJobSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.jobs = state.jobs.filter(job => job._id !== action.payload.jobId);
    },
    deleteJobFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateJobRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateJobSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.singleJob = action.payload;
      state.message = "Job updated successfully";
    },
    updateJobFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createJobRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createJobSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.jobs = [action.payload.job, ...state.jobs];
    },
    createJobFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getAllITJobsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllITJobsSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.jobs = action.payload.jobs;
    },
    getAllITJobsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getAllNonITJobsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllNonITJobsSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.jobs = action.payload.jobs;
    },
    getAllNonITJobsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const fetchJobs = (city, job_type, searchKeyword = "", page = 1) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestForAllJobs());

    let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/getall?`;
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
    dispatch(jobSlice.actions.successForAllJobs(response.data));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForAllJobs(error.response?.data?.message || "Failed to fetch jobs"));
  }
};


export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/get/${jobId}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForSingleJob(response.data.job));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForSingleJob(error.response.data.message));
  }
};
export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};
export const syncAppliedJobs = (appliedJobs) => (dispatch) => {
  dispatch(jobSlice.actions.setAppliedJobs(appliedJobs));
};

export const fetchLatestJobs = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.requestLatestJobs());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/latest`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successLatestJobs(data));
  } catch (error) {
    dispatch(
      jobSlice.actions.failureLatestJobs(
        error.response?.data?.message || "Failed to fetch latest jobs"
      )
    );
  }
};

export const deleteJob = (jobId) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.deleteJobRequest());
    const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/job/${jobId}`);
    dispatch(jobSlice.actions.deleteJobSuccess({ message: data.message, jobId }));
  } catch (error) {
    dispatch(
      jobSlice.actions.deleteJobFailure(
        error.response?.data?.message || "Error deleting job"
      )
    );
  }
};

export const updateJob = ({ jobId, updatedData }) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.updateJobRequest());
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/${jobId}`,
      updatedData,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.updateJobSuccess(data.job));
    return data;
  } catch (error) {
    dispatch(jobSlice.actions.updateJobFailure(error.response?.data?.message || "Failed to update job"));
  }
};

export const createJob = (jobData) => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.createJobRequest());
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/create`,
      jobData,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.createJobSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(jobSlice.actions.createJobFailed(error.response?.data?.message || "Failed to create job"));
    throw error;
  }
};

export const fetchAllITJobs = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.getAllITJobsRequest());
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/getall/it`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.getAllITJobsSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.getAllITJobsFailed(error.response?.data?.message || "Failed to fetch IT jobs"));
  }
};
export const fetchAllNonITJobs = () => async (dispatch) => {
  try {
    dispatch(jobSlice.actions.getAllNonITJobsRequest());
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/job/getall/non-it`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.getAllNonITJobsSuccess(response.data));
  } catch (error) {
    dispatch(jobSlice.actions.getAllNonITJobsFailed(error.response?.data?.message || "Failed to fetch non-IT jobs"));
  }
}
export const { clearErrors } = jobSlice.actions;
export default jobSlice.reducer;