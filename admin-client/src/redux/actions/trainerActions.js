import { SET_TRAINER_DATA } from "../types";

export const setTrainerData = (programsAssigned) => {   
    return {
        type: SET_TRAINER_DATA,
        payload: programsAssigned
    };
}
