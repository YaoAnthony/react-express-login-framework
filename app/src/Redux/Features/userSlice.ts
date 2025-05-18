// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";

type AuthState = {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
};

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    token: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            localStorage.setItem("accessToken", state.token);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem("accessToken");
        },

    },
});

export const { 
    setUser, 
    setToken, 
    logout 
} = userSlice.actions;
export default userSlice.reducer;
