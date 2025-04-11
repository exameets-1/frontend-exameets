import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    error: null,
    message: null,
    downloadMessage: null,
    matchedJobs: null,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    fetchUserRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      // Only update authentication state if we actually got user data
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      } else {
        state.isAuthenticated = false;
        state.user = {};
      }
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      // Only update these states if not on login/register pages
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        state.isAuthenticated = false;
        state.user = {};
        state.error = action.payload;
      }
    },
    resetAuthErrors(state) {
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed(state, action) {
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    deleteAccountRequest(state) {
      state.loading = true;
    },
    deleteAccountSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    deleteAccountFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePreferencesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updatePreferencesSuccess(state, action) {
      state.loading = false;
      state.user = {
        ...state.user,
        preferences: action.payload.preferences
      };
      state.error = null;
    },
    updatePreferencesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMatchedJobsRequest(state) {
      state.loading = true;
      state.error = null;
      state.matchedJobs = null;
    },
    fetchMatchedJobsSuccess(state, action) {
      state.loading = false;
      state.matchedJobs = action.payload;
      state.error = null;
    },
    fetchMatchedJobsFailed(state, action) {
      state.loading = false;
      state.matchedJobs = null;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          preferences: action.payload.preferences
        };
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const register = createAsyncThunk(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,    
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    const errorMessage = error.response.data.message || "Login failed";
    dispatch(userSlice.actions.loginFailed(errorMessage));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getuser`,    
      { withCredentials: true }
    );
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      userSlice.actions.fetchUserFailed(
        error.response?.data?.message || "Failed to load user"
      )
    );
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
      {
        withCredentials: true,
      }
    );
    dispatch(userSlice.actions.logoutSuccess());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response?.data?.message));
  }
};

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/preference/update`,
        {
          notifications_about: preferences.notifications_about,
          isStudying: preferences.isStudying,
          educationLevel: preferences.educationLevel,
          preferencesSet: true
        },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update preferences");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/delete`,
        {
          data: { password },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to delete account. Please try again.');
    }
  }
);

export const fetchMatchedJobs = ()  => async (dispatch) => {
  dispatch(userSlice.actions.fetchMatchedJobsRequest());
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/matchedjobs`,
      { withCredentials: true }
    );
    dispatch(userSlice.actions.fetchMatchedJobsSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      userSlice.actions.fetchMatchedJobsFailed(
        error.response?.data?.message || "Failed to fetch matched jobs"
      )
    );
  }
};

export const { resetAuthErrors, clearAllErrors: clearAllUserErrors } = userSlice.actions;
export default userSlice.reducer;