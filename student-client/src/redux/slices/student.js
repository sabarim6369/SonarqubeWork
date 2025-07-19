import { createSlice } from "@reduxjs/toolkit";

const initialState  = null
const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setStudent(state , action) {
            return action.payload
        }
    }
})

export const { setStudent } = studentSlice.actions
export default studentSlice.reducer