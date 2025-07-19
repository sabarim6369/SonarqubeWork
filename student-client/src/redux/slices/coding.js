import { createSlice } from "@reduxjs/toolkit";

const initialState  = null
const Coding = createSlice({
    name: "coding",
    initialState,
    reducers: {
        setCoding(state , action) {
            return action.payload
        }
    }
})

export const { setCoding } = Coding.actions
export default Coding.reducer