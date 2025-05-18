
import { User,PopulatedUser } from '../types/User';

/**
 * Check if a user is populated, according to profile and projects
 * 
 * @param user 
 * @returns true if the user is populated
 */
export function isPopulatedUser(user: User | PopulatedUser | null): user is PopulatedUser {
    return !!user && Array.isArray(user.projects) && typeof user.profile === 'object';
}