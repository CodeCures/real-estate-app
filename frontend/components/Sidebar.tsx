"use client"

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const session = useSession();
    const user = session.data?.user

    const pathname = usePathname()
    console.log({ pathname });

    const isActive = (path: string) => pathname === path

    const navStyle = 'focus:bg-gray-800 focus:text-white hover:bg-gray-800 hover:bg-opacity-20 flex w-full space-x-2 rounded-md px-10 py-4 text-gray-800 focus:outline-none transition-all duration-300 ease-in-out delay-75'

    return (
        <aside className="fixed z-50 md:relative">
            <input type="checkbox" className="peer hidden" id="sidebar-open" />
            <label className="peer-checked:rounded-full peer-checked:p-2 peer-checked:right-6 peer-checked:bg-gray-600 peer-checked:text-white absolute top-8 z-20 mx-4 cursor-pointer md:hidden" htmlFor="sidebar-open">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </label>
            <nav aria-label="Sidebar Navigation" className="peer-checked:w-64 left-0 z-10 flex h-screen w-0 flex-col overflow-hidden bg-gray-50 text-white transition-all md:h-screen md:w-64 lg:w-72">
                <div className="bg-gray-800 mt-5 py-4 pl-10 md:mt-0">
                    <span className="">
                        <span className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 align-bottom text-2xl font-bold">U</span>
                        <span className="text-xl">rbane</span>
                    </span>
                </div>
                <ul className="mt-8 space-y-3 ">
                    <li className="relative">
                        <Link href="/users" className={`${navStyle} ${isActive('/users') ? 'bg-gray-800 text-white' : ''}`}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            </span>
                            <span className="">Users</span>
                        </Link>
                        {
                            isActive('/users') && (
                                <svg className="text-slate-200 absolute -right-1 -top-1/2 z-10 hidden h-32 w-8 md:block" xmlns="http://www.w3.org/2000/svg" viewBox="399.349 57.696 100.163 402.081" width="1em" height="4em">
                                    <path fill="#111827" d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z" />
                                </svg>
                            )
                        }
                    </li>
                    <li className="relative">
                        <Link href="/properties" className={`${navStyle} ${isActive('/properties') ? 'bg-gray-800 text-white' : ''}`}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                </svg>
                            </span>
                            <span className="">Properties</span>
                            {
                                isActive('/properties') && (
                                    <svg className="text-slate-200 absolute -right-1 -top-1/2 z-10 hidden h-32 w-8 md:block" xmlns="http://www.w3.org/2000/svg" viewBox="399.349 57.696 100.163 402.081" width="1em" height="4em">
                                        <path fill="#111827" d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z" />
                                    </svg>
                                )
                            }
                        </Link>
                    </li>

                    <li className="relative">
                        <Link href="/insights" className={`${navStyle} ${isActive('/insights') ? 'bg-gray-800 text-white' : ''}`}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                </svg>
                            </span>
                            <span className="">AI Insights</span>
                            {
                                isActive('/insights') && (
                                    <svg className="text-slate-200 absolute -right-1 -top-1/2 z-10 hidden h-32 w-8 md:block" xmlns="http://www.w3.org/2000/svg" viewBox="399.349 57.696 100.163 402.081" width="1em" height="4em">
                                        <path fill="#111827" d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z" />
                                    </svg>
                                )
                            }
                        </Link>
                    </li>

                    <li className="relative">
                        <Link href="/portfolios" className={`${navStyle} ${isActive('/portfolios') ? 'bg-gray-800 text-white' : ''}`}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </span>
                            <span className="">Portfolio</span>
                            {
                                isActive('/portfolios') && (
                                    <svg className="text-slate-200 absolute -right-1 -top-1/2 z-10 hidden h-32 w-8 md:block" xmlns="http://www.w3.org/2000/svg" viewBox="399.349 57.696 100.163 402.081" width="1em" height="4em">
                                        <path fill="#111827" d="M 499.289 57.696 C 499.289 171.989 399.349 196.304 399.349 257.333 C 399.349 322.485 499.512 354.485 499.512 458.767 C 499.512 483.155 499.289 57.696 499.289 57.696 Z" />
                                    </svg>
                                )
                            }
                        </Link>
                    </li>
                    <li className="relative">
                        <button className="focus:bg-gray-800 focus:text-white hover:bg-gray-800 hover:bg-opacity-20 flex w-full space-x-2 rounded-md px-10 py-4 text-gray-800 focus:outline-none transition-all duration-300 ease-in-out delay-75">
                            <span
                            ><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span
                            ><span className="">Settings</span>
                        </button>
                    </li>
                </ul>

                <div className="my-6 mt-auto ml-10 flex cursor-pointer" onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>
                    <div>
                        <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                    </div>
                    <div className="ml-3">
                        <p className="font-medium text-black">{user?.name}</p>
                        <p className="text-sm text-gray-300">Logout</p>
                    </div>
                </div>
            </nav>
        </aside>
    )
}

export default Sidebar;