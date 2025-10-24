import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch active tests
export const fetchActiveTests = createAsyncThunk(
  'test/fetchActiveTests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://skillverse.exameets.in/api/test/active-tests');
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue('Failed to fetch tests');
      }
      
      return data.tests;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a question
export const addQuestion = createAsyncThunk(
  'test/addQuestion',
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://skillverse.exameets.in/api/test/add-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to add question');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create a test course
export const createTestCourse = createAsyncThunk(
  'test/createTestCourse',
  async (testData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://skillverse.exameets.in/api/test/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create test');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const testSlice = createSlice({
  name: 'test',
  initialState: {
    activeTests: [],
    isLoading: false,
    error: null,
    addQuestionStatus: {
      isLoading: false,
      error: null,
      success: false,
      response: null,
    },
    // added status for create test course
    createTestStatus: {
      isLoading: false,
      error: null,
      success: false,
      response: null,
    },
  },
  reducers: {
    clearAddQuestionStatus: (state) => {
      state.addQuestionStatus = {
        isLoading: false,
        error: null,
        success: false,
        response: null,
      };
    },
    // new reducer to clear create test status
    clearCreateTestStatus: (state) => {
      state.createTestStatus = {
        isLoading: false,
        error: null,
        success: false,
        response: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active tests
      .addCase(fetchActiveTests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeTests = action.payload;
      })
      .addCase(fetchActiveTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add question
      .addCase(addQuestion.pending, (state) => {
        state.addQuestionStatus.isLoading = true;
        state.addQuestionStatus.error = null;
        state.addQuestionStatus.success = false;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.addQuestionStatus.isLoading = false;
        state.addQuestionStatus.success = true;
        state.addQuestionStatus.response = action.payload;
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.addQuestionStatus.isLoading = false;
        state.addQuestionStatus.error = action.payload;
        state.addQuestionStatus.success = false;
      })

      // Create test course
      .addCase(createTestCourse.pending, (state) => {
        state.createTestStatus.isLoading = true;
        state.createTestStatus.error = null;
        state.createTestStatus.success = false;
      })
      .addCase(createTestCourse.fulfilled, (state, action) => {
        state.createTestStatus.isLoading = false;
        state.createTestStatus.success = true;
        state.createTestStatus.response = action.payload;
        // Optionally push the created test into activeTests if returned
        if (action.payload?.testCourse) {
          state.activeTests = state.activeTests || [];
          state.activeTests.push(action.payload.testCourse);
        }
      })
      .addCase(createTestCourse.rejected, (state, action) => {
        state.createTestStatus.isLoading = false;
        state.createTestStatus.error = action.payload;
        state.createTestStatus.success = false;
      });
  },
});

export const { clearAddQuestionStatus, clearCreateTestStatus } = testSlice.actions;
export default testSlice.reducer;

// export the thunks