import { GET_PROGRAMS, GET_TRAINERS, GET_COLLEGES, GET_PROBLEMS } from "../types";

export const setTrainers = (trainers) => {
  return {
    type: GET_TRAINERS,
    payload: trainers,
  };
};

export const setPrograms = (programs) => {
  return {
    type: GET_PROGRAMS,
    payload: programs,
  };
};

export const setColleges = (colleges) => {
  return {
    type: GET_COLLEGES,
    payload: colleges,
  };
};

export const setProblems = (problems) => {
  return {
    type: GET_PROBLEMS,
    payload: problems,
  };
};