import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const resultSlice = createSlice({
    name: "results",
    initialState: {
        results: [],
        result: null,
        loading: false,
        error: null,
        message: null,
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        latestResults: []
    },
    reducers: {
        requestStarted: (state) => {
            state.loading = true;
            state.error = null;
        },
        getResultsSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.results = action.payload.results;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalResults = action.payload.totalResults;
        },
        requestFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getSingleResultSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.result = action.payload.result;
        },
        clearErrors(state) {
            state.error = null;
            state.message = null;
        },
        resetResult(state) {
            state.result = null;
            state.latestResults = [];
        },
        requestLatestResults(state) {
            state.loading = true;
            state.error = null;
        },
        successLatestResults(state, action) {
            state.loading = false;
            state.error = null;
            state.latestResults = action.payload.results;
        },
        failureLatestResults(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.latestResults = [];
        },
        deleteResultRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteResultSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.results = state.results.filter(result => result._id !== action.payload.id);
        },
        deleteResultFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateResultRequest(state) {
            state.loading = true;
            state.error = null;
        },
        updateResultSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.result = action.payload.result;
            // Update results array if needed
            state.results = state.results.map(result => 
                result._id === action.payload.result._id ? action.payload.result : result
            );
        },
        updateResultFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createResultRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        createResultSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.results.unshift(action.payload.result);
        },
        createResultFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create AI Result
            .addCase("createAiResult/pending", (state) => {
                state.loading = true;
            })
            .addCase("createAiResult/fulfilled", (state, action) => {
                state.loading = false;
                state.results.unshift(action.payload.result);
                state.message = action.payload.message;
            })
            .addCase("createAiResult/rejected", (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

// Action Creators
export const {
    requestStarted,
    getResultsSuccess,
    requestFailed,
    getSingleResultSuccess,
    clearErrors,
    resetResult,
    requestLatestResults,
    successLatestResults,
    failureLatestResults,
    deleteResultRequest,
    deleteResultSuccess,
    deleteResultFailed,
    updateResultRequest,
    updateResultSuccess,
    updateResultFailed,
    createResultRequest,
    createResultSuccess,
    createResultFailed
} = resultSlice.actions;


export const createAiResult = createAsyncThunk(
    "result/createAi",
    async (resultData) => {
        try {
            const { data } = await axios.post(
                `https://api2.exameets.in/api/v1/result/process`,
                { resultDetails: resultData },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create AI result";
        }
    }
);

// Thunk Actions
export const fetchResults = (params = {}) => async (dispatch) => {
    try {
        dispatch(requestStarted());
        const { keyword = "", page = 1 } = params;
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/getall?page=${page}`;

        if(keyword) {
            url += `&keyword=${keyword}`;
        }

        const { data } = await axios.get(url, { withCredentials: true });
        dispatch(getResultsSuccess(data));
    } catch (error) {
        dispatch(requestFailed(error.response?.data?.message || "Failed to fetch results"));
    }
};

export const fetchSingleResult = (id) => async (dispatch) => {
    try {
        dispatch(requestStarted());
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/get/${id}`,
            { withCredentials: true }
        );
        dispatch(getSingleResultSuccess(data));
    } catch (error) {
        dispatch(requestFailed(error.response?.data?.message || "Result not found"));
    }
};

export const fetchLatestResults = () => async (dispatch) => {
    try {
        dispatch(requestLatestResults());
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/latest`,
            { withCredentials: true }
        );
        dispatch(successLatestResults(data));
    } catch (error) {
        dispatch(failureLatestResults(
            error.response?.data?.message || "Failed to fetch latest results"
        ));
    }
};

export const deleteResult = (id) => async (dispatch) => {
    try {
        dispatch(deleteResultRequest());
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/${id}`,
            { withCredentials: true }
        );
        dispatch(deleteResultSuccess({ id }));
    } catch (error) {
        dispatch(deleteResultFailed(
            error.response?.data?.message || "Failed to delete result"
        ));
    }
};

export const updateResult = (id, resultData) => async (dispatch) => {
    try {
        dispatch(updateResultRequest());
        const { data } = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/update/${id}`,
            resultData,
            { withCredentials: true }
        );
        dispatch(updateResultSuccess(data));
    } catch (error) {
        dispatch(updateResultFailed(
            error.response?.data?.message || "Failed to update result"
        ));
    }
};

export const createResult = (resultData) => async (dispatch) => {
    try {
        dispatch(createResultRequest());
        const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/create`,
            resultData,
            { withCredentials: true }
        );
        dispatch(createResultSuccess(data));
        return { success: true, data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error creating result';
        dispatch(createResultFailed(errorMessage));
        return { success: false, error: errorMessage };
    }
};

export const clearResultErrors = () => (dispatch) => {
    dispatch(clearErrors());
};

export const resetResultDetails = () => (dispatch) => {
    dispatch(resetResult());
};

export default resultSlice.reducer;