import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const previousYearSlice = createSlice({
  name: "previousYears",
  initialState: {
    subjects: [],
    papersBySubject: {},
    papersBySubjectAndYear: [],
    loading: false,
    error: null,
    message: null,
    latestYears: [],
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetPreviousYearState: (state) => {
      state.subjects = [];
      state.papersBySubject = {};
      state.papersBySubjectAndYear = [];
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Papers by Subject
      .addCase(fetchPapersBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPapersBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.papersBySubject[action.payload.subject] = action.payload.papersByYear;
      })
      .addCase(fetchPapersBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Papers by Subject and Year
      .addCase(fetchPapersBySubjectAndYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPapersBySubjectAndYear.fulfilled, (state, action) => {
        state.loading = false;
        state.papersBySubjectAndYear = action.payload.papers;
      })
      .addCase(fetchPapersBySubjectAndYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Previous Year
      .addCase(createPreviousYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPreviousYear.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createPreviousYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Previous Year
      .addCase(deletePreviousPaper.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePreviousPaper.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deletePreviousPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Previous Year
      .addCase(updatePreviousPaper.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePreviousPaper.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updatePreviousPaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Latest Years
      .addCase(fetchLatestYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestYears.fulfilled, (state, action) => {
        state.loading = false;
        state.latestYears = action.payload;
      })
      .addCase(fetchLatestYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Async Thunks
export const fetchSubjects = createAsyncThunk(
  "previousYears/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs`
      );
      return data.subjects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch subjects");
    }
  }
);

export const fetchPapersBySubject = createAsyncThunk(
  "previousYears/fetchPapersBySubject",
  async (subjectSlug, { rejectWithValue }) => {
    try {
      const decodedSubject = decodeURIComponent(subjectSlug);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs/${encodeURIComponent(decodedSubject)}`
      );
      return {
        subject: decodedSubject,
        papersByYear: data.papersByYear
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch papers");
    }
  }
);

export const fetchPapersBySubjectAndYear = createAsyncThunk(
  "previousYears/fetchPapersBySubjectAndYear",
  async ({ subjectSlug, year }, { rejectWithValue }) => {
    try {
      const decodedSubject = decodeURIComponent(subjectSlug);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs/${encodeURIComponent(decodedSubject)}/${year}`
      );
      return {
        subject: decodedSubject,
        year: year,
        papers: data.papers
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch year papers");
    }
  }
);

export const createPreviousYear = createAsyncThunk(
  "previousYear/create",
  async (paperData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs/add`,
        paperData,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create paper");
    }
  }
);

export const deletePreviousPaper = createAsyncThunk(
  "previousYear/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs/${id}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete paper");
    }
  }
);

export const updatePreviousPaper = createAsyncThunk(
  "previousYear/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs/${id}`,
        updates,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update paper");
    }
  }
);

export const fetchLatestYears = createAsyncThunk(
  "previousYears/fetchLatestYears",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/pyqs/latest`
      );
      return data.papers; // Assuming the backend returns the latest papers in `data.papers`
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch latest years");
    }
  }
);

export const { clearErrors, resetPreviousYearState } = previousYearSlice.actions;
export default previousYearSlice.reducer;