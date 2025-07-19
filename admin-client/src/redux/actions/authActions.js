import { SET_ADMIN, SET_AUTH_STATE, SET_TRAINER_DATA } from "../types";

export const setAuthState = (isAuthenticated, role, id) => {
  return {
    type: SET_AUTH_STATE,
    payload: {
      isAuthenticated,
      role,
      id
    }
  };
};

export const setAdmin = (adminProfile) => {
  return {
    type: SET_ADMIN,
    payload: {
      adminProfile
    }
  };
};

export const setTrainer = (trainerProfile) => {
  return {
    type: SET_TRAINER_DATA,
    payload: {
      trainerProfile
    }
  };
}
