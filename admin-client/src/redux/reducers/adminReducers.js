import {
  GET_PROGRAMS,
  GET_TRAINERS,
  GET_COLLEGES,
  GET_PROBLEMS,
} from "../types";
import { produce } from "immer";

const initialState = {
  trainers: null,
  programs: null,
  colleges: null,
  problems: null,
};

export const adminReducer = (state = initialState, action) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case GET_TRAINERS:
        draftState.trainers = action.payload;
        break;
      case GET_PROGRAMS:
        draftState.programs = action.payload.map((program) => ({
          ...program,
          dailyTasks: program.dailyTasks ? [...program.dailyTasks] : [],
        }));
        break;
      case GET_COLLEGES:
        draftState.colleges = action.payload;
        break;
      case GET_PROBLEMS:
        draftState.problems = action.payload;
        break;
      default:
        break;
    }
  });
};
