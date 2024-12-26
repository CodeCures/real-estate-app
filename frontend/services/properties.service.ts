"use server"

import createAxiosInstance from "@/utils/http"

export async function getProperties() {
    return (await ((await axios()).get('/properties'))).data
}

export async function getUserroperties(userId: string) {

}

async function axios() {
    return await createAxiosInstance()
}