import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import { adminReducer } from './reducers/adminReducers';
import { trainerReducer } from './reducers/trainerReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin:adminReducer,
    trainer:trainerReducer
  }
});

export default store;
