import { LoginPayload } from "@/types";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export async function login(payload: LoginPayload): Promise<boolean> {
    try {
        const result = await signIn('credentials', {
            redirect: false,
            ...payload,
        })

        if (result?.error) throw new Error("Invalid Credentials supplied")

        toast.success("User login successful")

        return true;
    } catch (error: any) {
        toast.error(error.message)
    }

    return false;
}
