import { Profile } from "./Profile";

// types/User.ts
export interface User {
    _id?: string;
    username: string;
    isVerified: boolean;
    email: string;
    vipLevel: number;
    image_url: string;

    // User has many projects
    projects: string[];
    profile: string;
}



export interface PopulatedUser extends Omit<User, 'profile'> {
    profile: Profile;
}
