import {configureStore} from '@reduxjs/toolkit';
import authenticateSlice from './slices/authenticate'

export const store =configureStore({
    reducer: {
        auth: authenticateSlice,
    },
});

export default store;

                      