import { createSlice } from "@reduxjs/toolkit";
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
        },
        updateResultFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createResultRequest(state) {
            state.loading = true;
            state.error = null;
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
    }
});

export const fetchResults = (params = {}) => async (dispatch) => {
    try {
        dispatch(resultSlice.actions.requestStarted());
        const { keyword = "", page = 1 } = params;
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/getall?page=${page}`;

        if(keyword) {
            link += `&keyword=${keyword}`;
        }

        const response = await axios.get(link, { withCredentials: true });
        dispatch(resultSlice.actions.getResultsSuccess(response.data));
    } catch (error) {
        dispatch(resultSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch results"));
    }
};

export const fetchSingleResult = (id) => async (dispatch) => {
    try {
        dispatch(resultSlice.actions.requestStarted());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/result/get/${id}`, {
            withCredentials: true
        });
        dispatch(resultSlice.actions.getSingleResultSuccess(response.data));
    } catch (error) {
        dispatch(resultSlice.actions.requestFailed(error.response.data.message));
    }
};

export const clearResultErrors = () => (dispatch) => {
    dispatch(resultSlice.actions.clearErrors());
};

export const resetResultDetails = () => (dispatch) => {
    dispatch(resultSlice.actions.resetResult());
};

export const fetchLatestResults = () => async (dispatch) => {
    try {
        dispatch(resultSlice.actions.requestLatestResults());
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/latest`,
            { withCredentials: true }
        );
        dispatch(resultSlice.actions.successLatestResults(data));
    } catch (error) {
        dispatch(
            resultSlice.actions.failureLatestResults(
                error.response?.data?.message || "Failed to fetch latest results"
            )
        );
    }
};

export const deleteResult = (id) => async (dispatch) => {
    try {
        dispatch(resultSlice.actions.deleteResultRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/result/${id}`, { withCredentials: true });
        dispatch(resultSlice.actions.deleteResultSuccess({ id }));
    } catch (error) {
        dispatch(resultSlice.actions.deleteResultFailed(error.response?.data?.message || "Failed to delete result"));
    }
};

export const updateResult = (resultId, updatedData) => async (dispatch) => {
    try {
        dispatch(resultSlice.actions.updateResultRequest());
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/result/update/${resultId}`,
            updatedData,
            { withCredentials: true }
        );
        dispatch(resultSlice.actions.updateResultSuccess(response.data));
    } catch (error) {
        dispatch(resultSlice.actions.updateResultFailed(error.response.data.message));
    }
};

export const createResult = (resultData) => async (dispatch) => {
    try {
        dispatch(resultSlice.actions.createResultRequest());
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/result/create`, resultData, { withCredentials: true });
        dispatch(resultSlice.actions.createResultSuccess(response.data));
        return { success: true };
    } catch (error) {
        dispatch(resultSlice.actions.createResultFailed(
            error.response?.data?.message || 'Error creating result'
        ));
        return { success: false, error: error.response?.data?.message };
    }
};

export default resultSlice.reducer;