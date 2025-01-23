import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const admitCardSlice = createSlice({
    name: "admitCards",
    initialState: {
        admitCards: [],
        admitCard: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalAdmitCards: 0,
        latestAdmitCards: []
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
        getAdmitCardsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admitCards = action.payload.admitCards;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalAdmitCards = action.payload.totalAdmitCards;
        },
        getSingleAdmitCardSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admitCard = action.payload.admitCard;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetAdmitCard(state) {
            state.admitCard = null;
            state.latestAdmitCards = [];
        },
        requestLatestAdmitCards(state) {
            state.loading = true;
            state.error = null;
        },
        successLatestAdmitCards(state, action) {
            state.loading = false;
            state.error = null;
            state.latestAdmitCards = action.payload.admitCards;
        },
        failureLatestAdmitCards(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.latestAdmitCards = [];
        }
    }
});

export const fetchAdmitCards = (searchKeyword = "", organization = "", status = "", page = 1) => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.requestStarted());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/getall?page=${page}`;
        
        if (searchKeyword) {
            link += `&searchKeyword=${searchKeyword}`;
        }
        if (organization) {
            link += `&organization=${organization}`;
        }
        if (status) {
            link += `&status=${status}`;
        }
        const response = await axios.get(link, { withCredentials: true });
        dispatch(admitCardSlice.actions.getAdmitCardsSuccess(response.data));
    } catch (error) {
        dispatch(admitCardSlice.actions.requestFailed(error.response.data.message));
    }
};

export const fetchSingleAdmitCard = (id) => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.requestStarted());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/get/${id}`, {
            withCredentials: true
        });
        dispatch(admitCardSlice.actions.getSingleAdmitCardSuccess(response.data));
    } catch (error) {
        dispatch(admitCardSlice.actions.requestFailed(error.response.data.message));
    }
};

export const clearAdmitCardErrors = () => async (dispatch) => {
    dispatch(admitCardSlice.actions.clearErrors());
};

export const resetAdmitCardDetails = () => async (dispatch) => {
    dispatch(admitCardSlice.actions.resetAdmitCard());
};

export const fetchLatestAdmitCards = () => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.requestLatestAdmitCards());
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/latest`,
            { withCredentials: true }
        );
        dispatch(admitCardSlice.actions.successLatestAdmitCards(data));
    } catch (error) {
        dispatch(
            admitCardSlice.actions.failureLatestAdmitCards(
                error.response?.data?.message || "Failed to fetch latest admit cards"
            )
        );
    }
};

export default admitCardSlice.reducer;