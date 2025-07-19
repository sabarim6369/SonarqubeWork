import { SET_ADMIN, SET_AUTH_STATE, SET_TRAINER_DATA } from "../types";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
    id: null,
    // IP:"http://localhost:8000/api",
    IP:import.meta.env.MODE==='development'?'http://localhost:8000/api':'https://rmsbackend.rampex.in'
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH_STATE:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        role: action.payload.role,
        id: action.payload.id,
      };
    case SET_ADMIN:
      return {
        ...state,
        user: action.payload.adminProfile,
      };
    case SET_TRAINER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
