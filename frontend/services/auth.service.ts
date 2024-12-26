"use server";

import { SignupFormSchema } from "@/lib/definitions";
import { LoginPayload, SignupFormState } from "@/types";
import createAxiosInstance from "@/utils/http";


async function register(state: SignupFormState, payload: FormData) {

  const validatedFields = SignupFormSchema.safeParse({
    name: payload.get('name'),
    email: payload.get('email'),
    role: payload.get('role'),
    password: payload.get('password'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const http = await createAxiosInstance()
    await http.post("/auth/register", validatedFields.data);
    return { success: true }
  } catch (error: any) {
    console.log("ERROR", error.message);
    return { success: false, messag: error.message }
  }
}

async function login(payload: LoginPayload) {
  const http = await createAxiosInstance()
  return (await (http).post('/auth/login', payload)).data
}

export { login, register };
