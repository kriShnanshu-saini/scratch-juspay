import { configureStore } from '@reduxjs/toolkit';
import spriteReducer from './spriteSlice';

export const store = configureStore({
	reducer: {
		sprites: spriteReducer,
	},
});
