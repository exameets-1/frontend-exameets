import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import updateProfileReducer from "./slices/updateProfileSlice.js"
import govtJobReducer from './slices/govtJobSlice.js'
import examReducer from "./slices/examSlice.js";
import internshipReducer from "./slices/internshipSlice.js";
import previousYearReducer from './slices/previousSlice.js';
import admissionReducer from './slices/admissionSlice.js';
import whatsNewReducer from './slices/whatsNewSlice.js';
import teamReducer from './slices/teamSlice.js';
import scholarshipReducer from './slices/scholarshipSlice.js';
import admitCardReducer from './slices/admitCardSlice.js';
import resultReducer from './slices/resultSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobReducer,
    updateProfile: updateProfileReducer,
    govtJobs : govtJobReducer,
    internships : internshipReducer,
    previousYears : previousYearReducer,
    exams : examReducer,
    admissions: admissionReducer,
    whatsNew: whatsNewReducer,
    team: teamReducer,
    scholarships: scholarshipReducer,
    admitCards: admitCardReducer,
    results: resultReducer
  },
});

export default store;