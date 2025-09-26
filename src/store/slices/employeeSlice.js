// src/store/slices/employeeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
        employees: [],
        employee: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalEmployees: 0
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
        getEmployeesSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.employees = action.payload.employees;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalEmployees = action.payload.totalEmployees;
        },
        getSingleEmployeeSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.employee = action.payload.employee;
        },
        clearErrors(state) {
            state.error = null;
        },
        resetEmployee(state) {
            state.error = null;
            state.employee = null;
        },
        deleteEmployeeRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteEmployeeSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.employees = state.employees.filter(emp => emp._id !== action.payload.id);
        },
        deleteEmployeeFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

// Async actions
export const fetchEmployees = (searchKeyword = "", page = 1) => async (dispatch) => {
    try {
        dispatch(employeeSlice.actions.requestStarted());
        let link = `${import.meta.env.VITE_BACKEND_URL}/api/v1/emp/getall?page=${page}`;
        if (searchKeyword) link += `&keyword=${searchKeyword}`;
        const response = await axios.get(link, { withCredentials: true });
        dispatch(employeeSlice.actions.getEmployeesSuccess(response.data));
    } catch (error) {
        dispatch(employeeSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch employees"));
    }
};

export const fetchSingleEmployee = (id) => async (dispatch) => {
    try {
        dispatch(employeeSlice.actions.requestStarted());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/emp/get/${id}`, { withCredentials: true });
        dispatch(employeeSlice.actions.getSingleEmployeeSuccess(response.data));
    } catch (error) {
        dispatch(employeeSlice.actions.requestFailed(error.response?.data?.message || "Failed to fetch employee details"));
    }
};

export const createEmployee = (employeeData) => async (dispatch) => {
    try {
        dispatch(employeeSlice.actions.requestStarted());
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/emp/new`, employeeData, { withCredentials: true });
        dispatch(employeeSlice.actions.requestFinished());
        return response.data;
    } catch (error) {
        dispatch(employeeSlice.actions.requestFailed(error.response?.data?.message || "Failed to create employee"));
        throw error;
    }
};

export const updateEmployee = (id, employeeData) => async (dispatch) => {
    try {
        dispatch(employeeSlice.actions.requestStarted());
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/emp/update/${id}`, employeeData, { withCredentials: true });
        dispatch(employeeSlice.actions.requestFinished());
        return response.data;
    } catch (error) {
        dispatch(employeeSlice.actions.requestFailed(error.response?.data?.message || "Failed to update employee"));
        throw error;
    }
};

export const deleteEmployee = (id) => async (dispatch) => {
    try {
        dispatch(employeeSlice.actions.deleteEmployeeRequest());
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/emp/delete/${id}`, { withCredentials: true });
        dispatch(employeeSlice.actions.deleteEmployeeSuccess({ id, message: response.data.message }));
        return response.data;
    } catch (error) {
        dispatch(employeeSlice.actions.deleteEmployeeFailed(error.response?.data?.message || "Failed to delete employee"));
        throw error;
    }
};

export const verifyEmployee = (empId) => async () => {
    // This could be used in a verification component to fetch employee by empId
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/emp/verify/${empId}`, { withCredentials: true });
    return response.data;
};

export const clearEmployeeErrors = () => async (dispatch) => {
    dispatch(employeeSlice.actions.clearErrors());
};

export const resetEmployeeDetails = () => async (dispatch) => {
    dispatch(employeeSlice.actions.resetEmployee());
};

export default employeeSlice.reducer;
