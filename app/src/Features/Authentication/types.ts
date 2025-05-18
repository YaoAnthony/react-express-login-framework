import { User } from "../../types/User";

/**
 * Defines the structure for a user credentials.
 */
export type Credentials = {
    email: string;
    password: string;
    state?: string;
}

export type LoginResponse = {
    accessToken: string; // return accessToken
}
export type RegisterResponse = {
    accessToken: string; // return accessToken
}

export type GoogleLoginRequest = {
    id_token: string;
}
export type GoogleLoginResponse = {
    accessToken: string;
    user: User;
}

export interface GithubLoginRequest {
    code: string;
  }
  
export interface GithubLoginResponse {
    accessToken: string;
    user: {
      _id: string;
      email: string;
      username: string;
      image_url?: string;
      vipLevel: number;
      profile: string;
    };
}

export type {
    User,
}

  

export const STATES = {
    idle: "Start",
    processing: "Processing",
    success: "Done",
    error: "Something went wrong",
} 