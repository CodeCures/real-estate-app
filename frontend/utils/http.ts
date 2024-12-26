"use server"
import { getUserSession } from "@/services/user.service";
import axios, { AxiosInstance } from "axios";

// Async function to initialize the Axios instance
const createAxiosInstance = async (): Promise<AxiosInstance> => {
    const session = await getUserSession();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (session?.user) {
        const user = session.user;
        headers['Authorization'] = `Bearer ${user.accessToken}`;
    }

    // Ensure API_BASE_URL is defined
    if (!process.env.API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined in the environment variables");
    }

    return axios.create({
        baseURL: process.env.API_BASE_URL,
        headers,
    });
};


export default createAxiosInstance;
