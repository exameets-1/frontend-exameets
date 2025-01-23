import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const examSlice = createSlice({
    name: "exams",
    initialState: {
        exams: [],
        exam: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalExams: 0
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
        getExamsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.exams = action.payload.exams;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalExams = action.payload.totalExams;
        },
        getSingleExamSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.exam = action.payload.exam;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetExam(state) {
            state.exam = null;
        }
    }
});

export const fetchExams = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(examSlice.actions.requestStarted());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/exam/getall?page=${page}`;
        
        if (searchKeyword) {
            link += `&searchKeyword=${searchKeyword}`;
        }

        const response = await axios.get(link, { withCredentials: true });
        dispatch(examSlice.actions.getExamsSuccess(response.data));
    } catch (error) {
        dispatch(examSlice.actions.requestFailed(error.response.data.message));
    }
};

export const fetchSingleExam = (id) => async (dispatch) => {
    try {
        dispatch(examSlice.actions.requestStarted());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/exam/get/${id}`, {
            withCredentials: true
        });
        dispatch(examSlice.actions.getSingleExamSuccess(response.data));
    } catch (error) {
        dispatch(examSlice.actions.requestFailed(error.response.data.message));
    }
};

export const clearExamErrors = () => async (dispatch) => {
    dispatch(examSlice.actions.clearErrors());
};

export const resetExamDetails = () => async (dispatch) => {
    dispatch(examSlice.actions.resetExam());
};

export default examSlice.reducer;
