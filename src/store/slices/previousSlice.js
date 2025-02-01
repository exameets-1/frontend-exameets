import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
    latestYears: [],
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
  },
  deleteYearRequest(state) {
    state.loading = true;
    state.error = null;
  },
  deleteYearSuccess(state, action) {
    state.loading = false;
    state.error = null;
    state.previousYears = state.previousYears.filter(year => year._id !== action.payload.id);
  },
  deleteYearFailed(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  updateYearRequest(state) {
    state.loading = true;
    state.error = null;
  },
  updateYearSuccess(state, action) {
    state.loading = false;
    state.error = null;
    state.previousYears = state.previousYears.map(year => 
      year._id === action.payload.previousYear._id ? action.payload.previousYear : year
    );
  },
  updateYearFailed(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  requestLatestYears(state) {
    state.loading = true;
    state.error = null;
  },
  successForLatestYears(state, action) {
    state.loading = false;
    state.error = null;
    state.latestYears = action.payload.previousYears;
  },
  failureForLatestYears(state, action) {
    state.loading = false;
    state.error = action.payload;
    state.latestYears = [];
  }
},
extraReducers: (builder) => {
  builder
    // Create Previous Year Paper
    .addCase(createPreviousYear.pending, (state) => {
      state.loading = true;
    })
    .addCase(createPreviousYear.fulfilled, (state, action) => {
      state.loading = false;
      state.previousYears.unshift(action.payload.previousYear);
      state.message = action.payload.message;
    })
    .addCase(createPreviousYear.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
});

// Create Previous Year Paper
export const createPreviousYear = createAsyncThunk(
    "previousYear/create",
    async (paperData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/previousyear/create`,
                paperData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create previous year paper");
        }
    }
);

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

export const fetchLatestYears = () => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.requestLatestYears());
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/previousyear/latest`, { withCredentials: true });
      dispatch(previousYearSlice.actions.successForLatestYears(data));
      
  } catch (error) {
      dispatch(previousYearSlice.actions.failureForLatestYears(error.response?.data?.message || "Failed to fetch latest years"));
  }
}

export const clearAllPreviousYearErrors = () => (dispatch) => {
  dispatch(previousYearSlice.actions.clearAllErrors());
};

export const resetPreviousYearSlice = () => (dispatch) => {
  dispatch(previousYearSlice.actions.resetYearSlice());
};

export const deleteYear = (id) => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.deleteYearRequest());
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/previousyear/${id}`, { withCredentials: true });
      dispatch(previousYearSlice.actions.deleteYearSuccess({ message: response.data.message, id }));
  } catch (error) {
      dispatch(previousYearSlice.actions.deleteYearFailed(error.response?.data?.message || "Failed to delete year"));
  }
};

export const updateYear = (id, yearData) => async (dispatch) => {
  try {
      dispatch(previousYearSlice.actions.updateYearRequest());
      const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/previousyear/update/${id}`,
          yearData,
          { withCredentials: true }
      );
      dispatch(previousYearSlice.actions.updateYearSuccess(response.data));
      return response.data;
  } catch (error) {
      dispatch(previousYearSlice.actions.updateYearFailed(error.response?.data?.message || "Failed to update year"));
      throw error;
  }
};

export const { clearErrors } = previousYearSlice.actions;
export default previousYearSlice.reducer;
