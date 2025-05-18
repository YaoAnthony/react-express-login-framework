export const getEnv = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
    if (!backendUrl) throw new Error("VITE_BACKEND_API_URL is missing in .env");
    if (!googleClientId) throw new Error("VITE_GOOGLE_CLIENT_ID is missing in .env");

    return {
      backendUrl,
      googleClientId,
    };
};
  