import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const admissionSlice = createSlice({
    name: "admissions",
    initialState: {
        admissions: [],
        admission: null,
        upcomingDeadlines: [],
        categories: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalAdmissions: 0,
        latestAdmissions: []
    },
    reducers: {
        requestStarted(state) {
            state.loading = true;
            state.error = null;
        },
        requestFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getAdmissionsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admissions = action.payload.admissions;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalAdmissions = action.payload.totalAdmissions;
            state.categories = action.payload.categories;
        },
        getSingleAdmissionSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admission = action.payload.admission;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetAdmission(state) {
            state.admission = null;
            state.latestAdmissions = [];
        },
        requestLatestAdmissions(state) {
            state.loading = true;
            state.error = null;
        },
        successLatestAdmissions(state, action) {
            state.loading = false;
            state.error = null;
            state.latestAdmissions = action.payload.admissions;
        },
        failureLatestAdmissions(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.latestAdmissions = [];
        }
    }
});

export const fetchAdmissions = (searchKeyword = "", category = "", level = "", page = 1) => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.requestStarted());
        let link = `http://localhost:4000/api/v1/admission/getall?page=${page}`;
        
        if (searchKeyword) {
            link += `&searchKeyword=${searchKeyword}`;
        }
        if (category) {
            link += `&category=${category}`;
        }

        const response = await axios.get(link, { withCredentials: true });
        dispatch(admissionSlice.actions.getAdmissionsSuccess(response.data));
    } catch (error) {
        dispatch(admissionSlice.actions.requestFailed(error.response.data.message));
    }
};

export const fetchSingleAdmission = (id) => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.requestStarted());
        const response = await axios.get(`http://localhost:4000/api/v1/admission/get/${id}`, {
            withCredentials: true
        });
        dispatch(admissionSlice.actions.getSingleAdmissionSuccess(response.data));
    } catch (error) {
        dispatch(admissionSlice.actions.requestFailed(error.response.data.message));
    }
};

export const clearAdmissionErrors = () => async (dispatch) => {
    dispatch(admissionSlice.actions.clearErrors());
};

export const resetAdmissionDetails = () => async (dispatch) => {
    dispatch(admissionSlice.actions.resetAdmission());
};

export const fetchLatestAdmissions = () => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.requestLatestAdmissions());
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/admission/latest`,
            { withCredentials: true }
        );
        dispatch(admissionSlice.actions.successLatestAdmissions(data));
    } catch (error) {
        dispatch(
            admissionSlice.actions.failureLatestAdmissions(
                error.response?.data?.message || "Failed to fetch latest admissions"
            )
        );
    }
};

export default admissionSlice.reducer;