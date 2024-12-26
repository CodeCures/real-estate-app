'use server'

import { Member } from "@/types";
import createAxiosInstance from "@/utils/http";


interface Porforlio {
    name: string;
    members: Member[]
}
export async function createPortfolio(payload: Porforlio) {
    const http = await createAxiosInstance()

    return (await http.post('/portfolios', payload)).data;
}

export async function getPortfolio(id: string) {
    const http = await createAxiosInstance()

    return (await http.post(`/portfolios/${id}`)).data;
}