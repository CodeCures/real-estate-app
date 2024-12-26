"use client"

import { register } from "@/services/auth.service";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

export default function RegistrationFrom() {

  const [state, formAction] = useActionState(register, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("User registered Successfully")
      router.push('login')
    }
  }, [state?.success, router])

  return (
    <>
      <form action={formAction}>
        <div className="mb-8">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
            <span className="text-red-500">&nbsp;*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <input
              id="name"
              name="name"
              className="outline-none block pr-10 shadow appearance-none border-2 border-orange-100 rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out"
              placeholder="Enter name"
            />
          </div>
          {state?.errors?.name && <span className="text-xs text-rose-500">{state.errors.name}</span>}
        </div>

        <div className="mb-8">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
            <span className="text-red-500">&nbsp;*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <input
              id="email"
              name="email"
              className="outline-none block pr-10 shadow appearance-none border-2 border-orange-100 rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out"
              placeholder="you@example.com"
            />
          </div>
          {state?.errors?.email && <span className="text-xs text-rose-500">{state.errors.email}</span>}
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
            <span className="text-red-500">&nbsp;*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input
              name="password"
              id="password"
              type="password"
              className="outline-none block pr-10 shadow appearance-none border-2 border-orange-100 rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out"
            />
          </div>
          {state?.errors?.password && <span className="text-xs text-rose-500">{state.errors.password}</span>}
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Role
            <span className="text-red-500">&nbsp;*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            </div>
            <select
              name="role"
              id="role"
              className="outline-none block pr-10 shadow appearance-none border-2 border-orange-100 rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out"
            >
              <option value="" >
                Select One
              </option>
              <option value="TENANT">Tenant</option>
              <option value="LANDLORD">Land Lord</option>
              <option value="INVESTOR">Investor</option>
            </select>
          </div>
          {state?.errors?.role && <span className="text-xs text-rose-500">{state.errors.role}</span>}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label
                className="block text-gray-500 font-bold"
                htmlFor="remember"
              >
                <input
                  className=" mr-2 w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 "
                  type="checkbox"
                  id="remember"
                  name="remember"
                />
                <span className="text-sm">Remember me</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4 text-center">
          <button
            className="transition grow w-full duration-500 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <hr />
        <div className="mt-8">
          <p className="text-sm space-x-1">
            Already Have An Account?
            <Link
              href="/login"
              className="font-bold text-sm text-orange-500 hover:text-orange-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
