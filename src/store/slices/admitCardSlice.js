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
    successLatestAdmitCards(state, action) {
      state.loading = false;
      state.error = null;
      state.latestAdmitCards = action.payload.admitCards;
    },
    deleteAdmitCardSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.admitCards = state.admitCards.filter(
        admitCard => admitCard._id !== action.payload.id
      );
    },
    updateAdmitCardSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.admitCard = action.payload.admitCard;
      state.message = "Admit card updated successfully";
    },
    clearMessage(state) {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      });

      builder
          // Create AI Admit Card
          .addCase(createAiAdmitCard.pending, (state) => {
              state.loading = true;
          })
          .addCase(createAiAdmitCard.fulfilled, (state, action) => {
              state.loading = false;
              state.admitCards.unshift(action.payload.admitCard);
              state.message = action.payload.message;
          })
          .addCase(createAiAdmitCard.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          });
  }
});

// Async Thunks
export const createAdmitCard = createAsyncThunk(
  "admitCard/create",
  async (admitCardData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/create`,
        {
          ...admitCardData,
          importantDates: admitCardData.importantDates.map(date => ({
            event: date.event,
            date: date.date
          })),
          examDetails: admitCardData.examDetails.map(detail => ({
            examDate: detail.examDate,
            shiftTimings: detail.shiftTimings,
            reportingTime: detail.reportingTime
          })),
          importantLinks: admitCardData.importantLinks.map(link => ({
            linkType: link.linkType,
            link: link.link
          }))
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createAiAdmitCard = createAsyncThunk(
    "admitCard/createAi",
    async (admitCardData) => {
        try {
            const { data } = await axios.post(
                `https://backend-exameets-production.up.railway.app/api/v1/admitcard/process`,
                { admitCardDetails: admitCardData },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create AI admit card";
        }
    }
);

export const fetchAdmitCards = (params = {}) => async (dispatch) => {
  try {
    dispatch(admitCardSlice.actions.requestStarted());
    const { searchKeyword = "", page = 1 } = params;
    
    // Reset to first page when searching
    const currentPage = searchKeyword ? 1 : page;
    
    const link = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/v1/admitcard/getall?page=${currentPage}&searchKeyword=${searchKeyword}`;
    
    const response = await axios.get(link, { withCredentials: true });
    dispatch(admitCardSlice.actions.getAdmitCardsSuccess(response.data));
  } catch (error) {
    dispatch(admitCardSlice.actions.requestFailed(error.response.data.message));
  }
};

export const fetchSingleAdmitCard = (id) => async (dispatch) => {
  try {
    dispatch(admitCardSlice.actions.requestStarted());
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/get/${id}`,
      { withCredentials: true }
    );
    dispatch(admitCardSlice.actions.getSingleAdmitCardSuccess(response.data));
  } catch (error) {
    dispatch(admitCardSlice.actions.requestFailed(error.response.data.message));
  }
};

export const fetchLatestAdmitCards = () => async (dispatch) => {
  try {
    dispatch(admitCardSlice.actions.requestStarted());
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/latest`,
      { withCredentials: true }
    );
    dispatch(admitCardSlice.actions.successLatestAdmitCards(data));
  } catch (error) {
    dispatch(admitCardSlice.actions.requestFailed(
      error.response?.data?.message || "Failed to fetch latest admit cards"
    ));
  }
};

export const deleteAdmitCard = (id) => async (dispatch) => {
  try {
    dispatch(admitCardSlice.actions.requestStarted());
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/${id}`,
      { withCredentials: true }
    );
    dispatch(admitCardSlice.actions.deleteAdmitCardSuccess({
      message: response.data.message,
      id
    }));
  } catch (error) {
    dispatch(admitCardSlice.actions.requestFailed(
      error.response?.data?.message || "Failed to delete admit card"
    ));
  }
};

export const updateAdmitCard = ({ admitCardId, updatedData }) => async (dispatch) => {
  try {
    dispatch(admitCardSlice.actions.requestStarted());
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/admitcard/update/${admitCardId}`,
      {
        ...updatedData,
        importantDates: updatedData.importantDates?.map(date => ({
          event: date.event,
          date: date.date
        })),
        examDetails: updatedData.examDetails?.map(detail => ({
          examDate: detail.examDate,
          shiftTimings: detail.shiftTimings,
          reportingTime: detail.reportingTime
        })),
        importantLinks: updatedData.importantLinks?.map(link => ({
          linkType: link.linkType,
          link: link.link
        }))
      },
      { withCredentials: true }
    );
    dispatch(admitCardSlice.actions.updateAdmitCardSuccess(data));
    return data;
  } catch (error) {
    dispatch(admitCardSlice.actions.requestFailed(
      error.response?.data?.message || "Failed to update admit card"
    ));
  }
};

export const { 
  requestStarted, 
  requestFailed, 
  getAdmitCardsSuccess, 
  getSingleAdmitCardSuccess, 
  clearErrors, 
  resetAdmitCard, 
  successLatestAdmitCards, 
  deleteAdmitCardSuccess, 
  updateAdmitCardSuccess, 
  clearMessage 
} = admitCardSlice.actions;
export default admitCardSlice.reducer;