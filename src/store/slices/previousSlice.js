import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const previousYearSlice = createSlice({
  name: "previousYears",
  initialState: {
    previousYears: [],
    loading: false,         
    error: null,
    message: null,
    year: null,
    currentPage: 1,
    totalPages: 1,
    totalYears: 0,
    appliedYears: [],
  },
  reducers: {
    requestForAllYears(state) {
    state.loading = true;
    state.error = null;
  },
  failureForAllYears(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  requestForSingleYear(state) {
    state.message = null;
    state.error = null;
    state.loading = true;
  },
  successForSingleYear(state, action) {
    state.loading = false;
    state.error = null;
    state.year = action.payload;
  },
  failureForSingleYear(state, action) {
    state.year = null;
    state.error = action.payload;
    state.loading = false;
  },
  clearAllErrors(state) {
    state.error = null;
    state.previousYears;
  },
  resetYearSlice(state) {
    state.error = null;
    state.previousYears = [];
    state.loading = false;
    state.message = null;
    state.year = null;
  },
  successForAllYears(state, action) {
    state.loading = false;
    state.previousYears = action.payload.previousYears;
    state.currentPage = action.payload.currentPage;
    state.totalPages = action.payload.totalPages;
    state.totalYears = action.payload.totalYears;
  },
  applyYearRequest(state) {
    state.loading = true;
  },
  applyYearSuccess(state, action) {
    state.loading = false;
    if (!state.appliedYears.includes(action.payload)) {
      state.appliedYears.push(action.payload);
    }
  },
  applyYearFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  setAppliedYears(state, action) {
    state.appliedYears = action.payload;
  }
},
});

export const fetchPreviousYears = (searchKeyword = "", page = 1, limit = 4) => async (dispatch) => {
    try {
        dispatch(previousYearSlice.actions.requestForAllYears());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/previousyear/getall?`;
        let queryParams = [`page=${page}`, `limit=${limit}`];
    
        if (searchKeyword) {
          queryParams.push(`searchKeyword=${searchKeyword}`);
        }
    
        link += queryParams.join("&");
        const response = await axios.get(link, { withCredentials: true });
        dispatch(previousYearSlice.actions.successForAllYears(response.data));
        dispatch(previousYearSlice.actions.clearAllErrors());
      } catch (error) {
        dispatch(previousYearSlice.actions.failureForAllYears(error.response.data.message));
      }
    }

export const fetchSinglepreviousYear = (yearId) => async (dispatch) => {
    dispatch(previousYearSlice.actions.requestForSingleYear());
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/previousyear/get/${yearId}`, { withCredentials: true });
        dispatch(previousYearSlice.actions.successForSingleYear(response.data.year));
        dispatch(previousYearSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(previousYearSlice.actions.failureForSingleYear(error.response.data.message));
    }
};

export const clearAllPreviousYearErrors = () => (dispatch) => {
    dispatch(previousYearSlice.actions.clearAllErrors());
};

export const resetPreviousYearSlice = () => (dispatch) => {
    dispatch(previousYearSlice.actions.resetYearSlice());
};


export const { clearErrors } = previousYearSlice.actions;
export default previousYearSlice.reducer;

