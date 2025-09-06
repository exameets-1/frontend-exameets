import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Admission
export const createAdmission = createAsyncThunk(
    "admission/create",
    async (admissionData) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admission/create`,
                admissionData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create admission";
        }
    }
);

export const createAiAdmission = createAsyncThunk(
    "admission/createAi",
    async (admissionData) => {
        try {
            const { data } = await axios.post(
                `https://api2.exameets.in/api/v1/admission/process`,
                { admissionDetails: admissionData },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create AI admission";
        }
    }
);

const admissionSlice = createSlice({
    name: "admissions",
    initialState: {
        admissions: [],
        admission: null,
        categories: [],
        loading: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalAdmissions: 0,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
            limit: 8
        },
        filters: {
            categories: [],
            availableSortFields: []
        },
        latestAdmissions: [],
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
        getAdmissionsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admissions = action.payload.admissions;
            state.pagination = action.payload.pagination;
            state.filters = action.payload.filters;
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
        },
        deleteAdmissionRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteAdmissionSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admissions = state.admissions.filter(admission => admission._id !== action.payload.id);
        },
        deleteAdmissionFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateAdmissionRequest(state) {
            state.loading = true;
            state.error = null;
        },
        updateAdmissionSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.admission = action.payload.admission;
            state.message = "Admission updated successfully";
        },
        updateAdmissionFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Admission
            .addCase(createAdmission.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAdmission.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions.unshift(action.payload.admission);
                state.message = action.payload.message;
            })
            .addCase(createAdmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        builder
            // Create AI Admission
            .addCase(createAiAdmission.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAiAdmission.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions.unshift(action.payload.admission);
                state.message = action.payload.message;
            })
            .addCase(createAiAdmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const fetchAdmissions = ({ searchKeyword = "", category = "All", location = "All", page = 1, sortBy = "last_date", sortOrder = "asc", showActiveOnly = false }) => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.requestStarted());

        let url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/admission/getall?`;
        const params = new URLSearchParams();

        if (searchKeyword) params.append("searchKeyword", searchKeyword);
        if (category !== "All") params.append("category", category);
        if (location !== "All") params.append("location", location);
        if (page) params.append("page", page);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        params.append("showActiveOnly", showActiveOnly);

        url += params.toString();

        const { data } = await axios.get(url, { withCredentials: true });

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch admissions");
        }

        dispatch(admissionSlice.actions.getAdmissionsSuccess(data));
    } catch (error) {
        dispatch(admissionSlice.actions.requestFailed(
            error.response?.data?.message || error.message || "Failed to fetch admissions"
        ));
    }
};

export const fetchSingleAdmission = (id) => async (dispatch) => {
    try {
        dispatch(admissionSlice.actions.deleteAdmissionRequest());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admission/get/${id}`, {
            withCredentials: true
        });
        dispatch(admissionSlice.actions.getSingleAdmissionSuccess(response.data));
    } catch (error) {
        dispatch(admissionSlice.actions.deleteAdmissionFailed(error.response.data.message));
        // toast.error(error.response.data.message);
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

export const deleteAdmission = (id) => async(dispatch) => {
    try {
        dispatch(admissionSlice.actions.deleteAdmissionRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admission/delete/${id}`, {
            withCredentials: true
        });
        dispatch(admissionSlice.actions.deleteAdmissionSuccess({ message: response.data.message, id }));
    } catch (error) {
        dispatch(admissionSlice.actions.deleteAdmissionFailed(error.response?.data?.message));
    }
}

export const updateAdmission = ({ admissionId, updatedData }) => async (dispatch) => {
    try {
      dispatch(admissionSlice.actions.updateAdmissionRequest());
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admission/update/${admissionId}`,
        updatedData,
        { withCredentials: true }
      );
      dispatch(admissionSlice.actions.updateAdmissionSuccess(data));
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update admission";
      dispatch(admissionSlice.actions.updateAdmissionFailure(errorMessage));
      // Throw error to trigger catch in component
      throw new Error(errorMessage);
    }
  };

export default admissionSlice.reducer;