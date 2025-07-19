import { SET_TRAINER_DATA } from "../types";
import {produce} from 'immer';  

const initialState = {
    assignedPrograms: null,
};

export const trainerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TRAINER_DATA:
            return produce(state, draftState => {  
                draftState.assignedPrograms = action.payload;
            });
        default:
            return state;
    }
};
