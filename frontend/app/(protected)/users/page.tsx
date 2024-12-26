import BreadCrumbComponent from "@/components/BreadCrumbComponent";
import DashboardLayout from "@/components/DashboardLayout";
import UserTable from "@/components/UserTable";
import { getUsers } from "@/services/user.service";
import { User } from "@/types";

export default async function Page() {
    let users: User[] = (await getUsers()).users

    return (
        <DashboardLayout>
            <div className="w-[895px]">
                <div className="flex flex-col gap-5 max-w-full" >
                    <BreadCrumbComponent currentPage='Users' />
                    <div className=" flex justify-between flex-wrap gap-x-5 gap-y-2 items-center mb-10">
                        <h3 className=" font-semibold grow text-2xl text-gray-200">All Users</h3>
                        <div className="flex flex-wrap gap-2 items-center space-x-5">
                            <button
                                className=" bg-orange-500 hover:bg-orange-600 border-2 border-orange-500  grow min-w-[10rem] text-center text-white rounded-lg px-5 py-2.5 transition duration-300 ease-in-out flex space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                                <span className="capitalize">Add New User</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-auto lg:overflow-visible ">
                    <UserTable initialData={users} />
                </div>
            </div>
        </DashboardLayout>
    )
}

