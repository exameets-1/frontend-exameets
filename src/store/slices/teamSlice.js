import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const teamSlice = createSlice({
    name: "teams",
    initialState: {
        teams: [],
        pendingTeams: [],
        team: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalTeams: 0
    },
    reducers: {
        requestStarted(state) {
            state.loading = true;
            state.error = null;
        },
        requestFinished(state) {
            state.loading = false;
            state.error = null;
        },
        requestFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getTeamsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.teams = action.payload.teams;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalTeams = action.payload.totalTeams;
        },
        getSingleTeamSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.team = action.payload.team;
        },
        clearErrors(state) {
            state.error = null;
        },
        getPendingTeamsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.pendingTeams = action.payload.teams;
        },
        resetTeam(state) {
            state.error = null;
            state.team = null;
        },
        deleteTeamRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteTeamSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.teams = state.teams.filter(team => team._id !== action.payload.id);
            state.pendingTeams = state.pendingTeams.filter(team => team._id !== action.payload.id);
        },
        deleteTeamFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        approveTeamRequest(state) {
            state.loading = true;
            state.error = null;
        },
        approveTeamSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.pendingTeams = state.pendingTeams.filter(team => team._id !== action.payload.team._id);
            // Consider refetching approved teams here or rely on subsequent navigation
        },
        approveTeamFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const fetchPendingTeams = () => async (dispatch, getState) => {
    // Check if already loading
    const { loading } = getState().team;
    if (loading) {
        return;
    }
    
    try {
        dispatch(teamSlice.actions.requestStarted());
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/team/getall?status=pending`, 
            { withCredentials: true }
        );
        dispatch(teamSlice.actions.getPendingTeamsSuccess(response.data));
    } catch (error) {
        dispatch(teamSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch pending teams"));
    }
};

// Add action for approving team
export const approveTeam = (id) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.approveTeamRequest());
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/team/approve/${id}`, 
            {}, 
            { withCredentials: true }
        );
        dispatch(teamSlice.actions.approveTeamSuccess({ 
            message: response.data.message,
            team: response.data.team
        }));
        return response.data;
    } catch (error) {
        dispatch(teamSlice.actions.approveTeamFailed(error.response?.data?.message || "Failed to approve team"));
        throw error;
    }
};

export const createTeam = (teamData) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.requestStarted());
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/team/new`, 
            teamData,
            { withCredentials: true }
        );
        dispatch(teamSlice.actions.requestFinished());
        return response.data;
    } catch (error) {
        dispatch(teamSlice.actions.requestFailed(error.response?.data?.message || "Failed to create team"));
        throw error;
    }
};

export const fetchTeams = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.requestStarted());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/team/getall?page=${page}`;
        
        if (searchKeyword) {
            link += `&keyword=${searchKeyword}`;
        }

        const response = await axios.get(link, { withCredentials: true });
        dispatch(teamSlice.actions.getTeamsSuccess(response.data));
    } catch (error) {
        dispatch(teamSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch teams"));
    }
};

export const fetchSingleTeam = (id) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.requestStarted());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/team/get/${id}`, {
            withCredentials: true
        });
        dispatch(teamSlice.actions.getSingleTeamSuccess(response.data));
    } catch (error) {
        dispatch(teamSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch team details"));
    }
};

export const clearTeamErrors = () => async (dispatch) => {
    dispatch(teamSlice.actions.clearErrors());
};

export const resetTeamDetails = () => async (dispatch) => {
    dispatch(teamSlice.actions.resetTeam());
};

export const deleteTeam = (id) => async (dispatch) => {
    try {
        dispatch(teamSlice.actions.deleteTeamRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/team/${id}`, { withCredentials: true });
        dispatch(teamSlice.actions.deleteTeamSuccess({ message: response.data.message, id }));
        return response.data;
    } catch (error) {
        dispatch(teamSlice.actions.deleteTeamFailed(error.response?.data?.message || "Failed to delete team"));
        throw error;
    }
};

export default teamSlice.reducer;