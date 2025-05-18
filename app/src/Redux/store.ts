// redux toolkit
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// reducers
import userReducer from './Features/userSlice';
import themeReducer from './Features/themeSlice';

// redux toolkit api
import { authApi } from "../Features/Authentication/services";
import { profileApi } from "../api/profileApi";

export const store = configureStore({
    reducer: {
        theme: themeReducer,

        user: userReducer,
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            profileApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
