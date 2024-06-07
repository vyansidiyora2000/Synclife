import { configureStore } from "@reduxjs/toolkit";
import habitSlice from "../reducers/habitSlice";
import journalSlice from "../reducers/journalSlice";
import authSlice from "../reducers/authSlice";
import gratiSlice from "../reducers/gratiSlice";
import moodSlice from "../reducers/moodSlice";

export const store = configureStore({
    reducer:{
        habit:habitSlice,
        list:journalSlice,
        auth:authSlice,
        gratitude:gratiSlice,
        mood:moodSlice,
    },
});