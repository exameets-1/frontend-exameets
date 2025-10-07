import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/task`;

// ================== ASYNC THUNKS ==================

// Create Task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/create`, taskData, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

// Get Single Task
export const getSingleTask = createAsyncThunk(
  'task/getSingleTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/get/${taskId}`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/delete/${taskId}`, { withCredentials: true });
      return { ...data, taskId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

// Get Tasks by Column
export const getNotStartedTasks = createAsyncThunk(
  'task/getNotStartedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/not-started`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const getInProgressTasks = createAsyncThunk(
  'task/getInProgressTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/in-progress`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const getCompletedTasks = createAsyncThunk(
  'task/getCompletedTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/completed`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const getTasksAssignedToMe = createAsyncThunk(
  'task/getTasksAssignedToMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/assigned-to-me`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const getTasksAssignedToOthers = createAsyncThunk(
  'task/getTasksAssignedToOthers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/assigned-to-others`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

// Update Progress
export const updateProgress = createAsyncThunk(
  'task/updateProgress',
  async ({ taskId, currentProgress }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/update-progress/${taskId}`,
        { currentProgress },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
    }
  }
);

// Submit for Review
export const submitForReview = createAsyncThunk(
  'task/submitForReview',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/submit-for-review/${taskId}`,
        {},
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit for review');
    }
  }
);

// Approve Task
export const approveTask = createAsyncThunk(
  'task/approveTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/approve/${taskId}`,
        {},
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve task');
    }
  }
);

// Request Changes
export const requestChanges = createAsyncThunk(
  'task/requestChanges',
  async ({ taskId, feedback }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/request-changes/${taskId}`,
        { feedback },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request changes');
    }
  }
);

// Add Comment
export const addComment = createAsyncThunk(
  'task/addComment',
  async ({ taskId, comment }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/comment/${taskId}`,
        { comment },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

// ================== TASK SLICE ==================

const taskSlice = createSlice({
  name: "task",
  initialState: {
    loading: false,
    error: null,
    message: null,
    currentTask: null,
    
    // Column data
    notStartedTasks: [],
    inProgressTasks: [],
    completedTasks: [],
    assignedToMeTasks: [],
    assignedToOthersTasks: [],
  },
  
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    clearMessage: (state) => {
      state.message = null;
    },
    
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    
    // Update task in all relevant columns
    updateTaskInColumns: (state, action) => {
      const task = action.payload;
      const columns = [
        'notStartedTasks',
        'inProgressTasks', 
        'completedTasks',
        'assignedToMeTasks',
        'assignedToOthersTasks'
      ];
      
      columns.forEach(column => {
        const index = state[column].findIndex(t => t._id === task._id);
        if (index !== -1) {
          state[column][index] = task;
        }
      });
      
      if (state.currentTask?._id === task._id) {
        state.currentTask = task;
      }
    },
    
    // Remove task from all columns
    removeTaskFromColumns: (state, action) => {
      const taskId = action.payload;
      const columns = [
        'notStartedTasks',
        'inProgressTasks',
        'completedTasks', 
        'assignedToMeTasks',
        'assignedToOthersTasks'
      ];
      
      columns.forEach(column => {
        state[column] = state[column].filter(t => t._id !== taskId);
      });
      
      if (state.currentTask?._id === taskId) {
        state.currentTask = null;
      }
    },
  },
  
  extraReducers: (builder) => {
    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Single Task
    builder
      .addCase(getSingleTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload.task;
      })
      .addCase(getSingleTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Task
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.message = action.payload.message;
        taskSlice.caseReducers.removeTaskFromColumns(state, { payload: action.payload.taskId });
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Get Not Started Tasks
    builder
      .addCase(getNotStartedTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotStartedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.notStartedTasks = action.payload.tasks || [];
      })
      .addCase(getNotStartedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get In Progress Tasks
    builder
      .addCase(getInProgressTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInProgressTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.inProgressTasks = action.payload.tasks || [];
      })
      .addCase(getInProgressTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Completed Tasks
    builder
      .addCase(getCompletedTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompletedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.completedTasks = action.payload.tasks || [];
      })
      .addCase(getCompletedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Tasks Assigned to Me
    builder
      .addCase(getTasksAssignedToMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasksAssignedToMe.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedToMeTasks = action.payload.tasks || [];
      })
      .addCase(getTasksAssignedToMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Tasks Assigned to Others
    builder
      .addCase(getTasksAssignedToOthers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasksAssignedToOthers.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedToOthersTasks = action.payload.tasks || [];
      })
      .addCase(getTasksAssignedToOthers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Progress
    builder
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.message = action.payload.message;
        taskSlice.caseReducers.updateTaskInColumns(state, { payload: action.payload.task });
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Submit for Review
    builder
      .addCase(submitForReview.fulfilled, (state, action) => {
        state.message = action.payload.message;
        taskSlice.caseReducers.updateTaskInColumns(state, { payload: action.payload.task });
      })
      .addCase(submitForReview.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Approve Task
    builder
      .addCase(approveTask.fulfilled, (state, action) => {
        state.message = action.payload.message;
        taskSlice.caseReducers.updateTaskInColumns(state, { payload: action.payload.task });
      })
      .addCase(approveTask.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Request Changes
    builder
      .addCase(requestChanges.fulfilled, (state, action) => {
        state.message = action.payload.message;
        taskSlice.caseReducers.updateTaskInColumns(state, { payload: action.payload.task });
      })
      .addCase(requestChanges.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Add Comment
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.message = action.payload.message;
        if (action.payload.task) {
          state.currentTask = action.payload.task;
          taskSlice.caseReducers.updateTaskInColumns(state, { payload: action.payload.task });
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearCurrentTask,
  updateTaskInColumns,
  removeTaskFromColumns,
} = taskSlice.actions;

export default taskSlice.reducer;