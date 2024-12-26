"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createAxiosInstance from "@/utils/http";
import { getServerSession } from "next-auth";

export async function getUserSession() {
    return await getServerSession(authOptions)
}

export async function getUsers() {
    const http = await createAxiosInstance();
    return (await http.get('/users')).data;
}

export async function updateUser(userId: string, role: string) {
    const http = await createAxiosInstance();
    await http.patch(`/users/${userId}`, { role })
}

export async function deleteUser(userId: string) {
    const http = await createAxiosInstance();
    await http.delete(`/users/${userId}`)
}