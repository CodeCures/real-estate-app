"use client"

import { FormEvent, MouseEvent, MouseEventHandler, useState } from "react";
import properties from '@/jsonFiles/properties.json';
import CustomCard from '@/components/CustomCard';
import DashboardLayout from '@/components/DashboardLayout';
import BreadCrumbComponent from '@/components/BreadCrumbComponent';
import toast from "react-hot-toast";
import { createPortfolio } from "@/services/portfolio.service";
import { Member } from "@/types";
import { useRouter } from "next/navigation";



export default function Page() {
    const [members, setMembers] = useState<Member[]>([])
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const router = useRouter();

    function addMember(e: MouseEvent) {
        e.preventDefault();

        if (email === '' || role === '') {
            toast.error("Please fill all fields to continue")
            return;
        }

        setMembers((prevMembers) => [
            ...prevMembers,
            { email, role }
        ])

        setEmail("")
        setRole("")
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (name === '') {
            toast.error("Portfolio name required")
            return;
        }

        try {
            const { portfolio } = await createPortfolio({ name, members })

            toast.success('Portfolio Created successfully!')
            router.push(`/portfolios/${portfolio.id}`)
        } catch (error: any) {
            toast.error("ERROR: ", error.message)
        }

    }

    return (

        <DashboardLayout>
            <div className="w-[895px]">

                <div className="flex flex-col gap-5 max-w-full " >
                    <BreadCrumbComponent currentPage='Portfolio' />
                    <div className=" flex justify-between flex-wrap gap-x-5 gap-y-2 items-center mb-10">
                        <h3 className=" font-semibold grow text-2xl text-gray-200">Create A portfolio</h3>
                    </div>
                </div>
                <div className="overflow-auto lg:overflow-visible  h-[60vh] flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-[600px] mx-auto  border-[.5px] border-gray-500 p-5">
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300 dark:text-white">PortFolio Name</label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} id="name" name="name" className="bg-transparent shadow-sm bg-gray-50 border border-gray-500 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Joint Investment portfolio" required />
                        </div>
                        {members.length > 0 && (
                            <div className="mb-3">
                                <h2 className="mb-2 text-lg font-semibold text-gray-300 dark:text-white">Portfolio Members</h2>
                                <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                    {members.map((m, i) => (
                                        <li key={i} className="flex items-center">
                                            <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                            </svg>
                                            {m.email} ({m.role})
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        )}

                        <div className="grid grid-flow-col grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="email" className="bg-transparent shadow-sm bg-gray-50 border border-gray-500 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@flowbite.com" />
                            </div>
                            <div className="col-span-1">
                                <select onChange={(e) => setRole(e.target.value)} defaultValue={role} id="countries" className="bg-transparent border border-gray-500 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option>Choose a role</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="CONTRIBUTOR">Contributor</option>
                                    <option value="VIEWER">Viewer</option>
                                </select>
                            </div>
                        </div>


                        <div className="mb-5">
                            <a onClick={(e) => addMember(e)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline float-right cursor-pointer">Add A Member</a>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
                    </form>

                </div>
            </div>
        </DashboardLayout>
    )
}

