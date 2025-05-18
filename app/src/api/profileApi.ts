//RTK Query
import { 
    createApi, 
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";

//types
import { User } from "../types/User";

//env
import { getEnv } from '../config/env';
  
  
const { backendUrl } = getEnv();  

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: backendUrl as string 
    }),
    endpoints: (builder) => ({

        getProfile: builder.query<User, string>({
            query: (token) => ({
                url: '/profile/getProfile',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
    }),
});




export const { 
    
    useLazyGetProfileQuery,
} = profileApi;
