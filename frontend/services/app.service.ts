'use server'

import createAxiosInstance from "@/utils/http";

export async function getDashboardStats() {
    const http = await createAxiosInstance();
    return (await http.get('/dashboard-stats')).data
}

export async function chatWithEliza(payload: { text: string }) {
    const http = await createAxiosInstance();
    const agentId = process.env.AGENT_ID;

    return (await http.post(`${agentId}/message`, payload)).data
}