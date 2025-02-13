import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
        latestAdmitCards: [],
        message: null
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
        },
        deleteAdmitCardSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admitCards = state.admitCards.filter(admitCard => admitCard._id !== action.payload.id);
        },
        deleteAdmitCardFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteAdmitCardRequest(state) {
            state.loading = true;
            state.error = null;
        },
        updateAdmitCardRequest(state) {
            state.loading = true;
            state.error = null;
        },
        updateAdmitCardSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admitCard = action.payload.admitCard;
            state.message = "Admit card updated successfully";
        },
        updateAdmitCardFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearMessage(state) {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Admit Card
            .addCase(createAdmitCard.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAdmitCard.fulfilled, (state, action) => {
                state.loading = false;
                state.admitCards.unshift(action.payload.admitCard);
                state.message = action.payload.message;
            })
            .addCase(createAdmitCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const createAdmitCard = createAsyncThunk(
    "admitCard/create",
    async (admitCardData) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/create`,
                admitCardData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response.data.message;
        }
    }
);

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

export const deleteAdmitCard = (id) => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.deleteAdmitCardRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/${id}`, { withCredentials: true });
        dispatch(admitCardSlice.actions.deleteAdmitCardSuccess({ message: response.data.message, id }));
    } catch (error) {
        dispatch(admitCardSlice.actions.deleteAdmitCardFailed(error.response?.data?.message || "Failed to delete admit card"));
    }
};

export const updateAdmitCard = ({ admitCardId, updatedData }) => async (dispatch) => {
    try {
        dispatch(admitCardSlice.actions.updateAdmitCardRequest());
        const { data } = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/update/${admitCardId}`,
            updatedData,
            { withCredentials: true }
        );
        dispatch(admitCardSlice.actions.updateAdmitCardSuccess(data.admitCard));
        return data;
    } catch (error) {
        dispatch(admitCardSlice.actions.updateAdmitCardFailure(error.response?.data?.message || "Failed to update admit card"));
    }
};

export const { clearMessage } = admitCardSlice.actions;
export default admitCardSlice.reducer;