import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const whatsNewSlice = createSlice({
    name: 'whatsNew',
    initialState: {
        items: [],
        loading: false,
        error: null
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
        getWhatsNewSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.items = action.payload.whatsNew;
        }
    }
});

// Action creator for fetching what's new items
export const fetchWhatsNew = () => async (dispatch) => {
    try {
        dispatch(whatsNewSlice.actions.requestStarted());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/whatsnew/getall`, {
            withCredentials: true
        });
        dispatch(whatsNewSlice.actions.getWhatsNewSuccess(response.data));
    } catch (error) {
        dispatch(whatsNewSlice.actions.requestFailed(error.response.data.message));
    }
};

export default whatsNewSlice.reducer;
