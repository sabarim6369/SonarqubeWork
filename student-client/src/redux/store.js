import { configureStore } from '@reduxjs/toolkit';
import studentReducer from "./slices/student"
import codingReducer from "./slices/coding";
export const store = configureStore({
    devTools : true,
    reducer : {
        student: studentReducer,
        coding: codingReducer
    }
})
