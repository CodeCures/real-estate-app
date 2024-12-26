'use client'

import { User } from '@/types'
import React, { FormEvent, MouseEvent, useState } from 'react'
import CustomModal from './CustomModal'
import { deleteUser, getUsers, updateUser } from '@/services/user.service'
import toast from 'react-hot-toast'

const UserTable = ({ initialData }: { initialData: User[] }) => {
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userData, setUserData] = useState<User | null>();
    const [users, setUsers] = useState<User[]>(initialData)

    const [deleting, setDeleting] = useState(false)

    function editUser(user: User) {
        setOpenModal(true);
        setUserData(user);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            await updateUser(userData?.id as string, formData.get('role') as string)
            toast.success('User role updated successfully!')
        } catch (error) {
            console.log(error);

            toast.error('Unable to update user role, please try again at a later time')
        }

        const res = await getUsers();

        setUsers(res.users);

        setOpenDeleteModal(false);
        setUserData(null)
    }

    function showDeletModal(user: User) {
        setUserData(user);
        setOpenDeleteModal(true);
    }

    async function handleDelete(e: MouseEvent) {
        e.preventDefault();
        setDeleting(true);

        try {
            await deleteUser(userData?.id as string)
            toast.success('User Deleted successfully!')
        } catch (error: any) {
            toast.error('Oops! you cannot delete a user with active records')
        }

        const res = await getUsers();

        setUsers(res.users);

        setDeleting(false)
        setOpenDeleteModal(false);
        setUserData(null);
    }
    return (
        <>
            <table className="table text-gray-400 border-separate space-y-6 text-sm w-full">
                <thead className="bg-gray-800 text-gray-500">
                    <tr>
                        <th className="p-3">UserName</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="bg-gray-800">
                            <td className="p-3">
                                <div className="flex align-items-center">
                                    <img className="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image" />
                                    <div className="ml-3">
                                        <div className="">{user.name}</div>
                                        <div className="text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3">
                                {user.role}
                            </td>

                            <td className="p-3 space-x-3">
                                <button onClick={() => editUser(user)} className="bg-yellow-400 text-white px-3 py-1.5 text-xs rounded-md">Edit role</button>
                                <button onClick={() => showDeletModal(user)} className="bg-red-500 text-white px-3 py-1.5 text-xs rounded-md">Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>

            <CustomModal title='Update User Role' openModal={openModal} onCloseModal={() => setOpenModal(false)}>

                <form className="max-w-sm mx-auto space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a role</label>
                        <select defaultValue={userData?.role} id="role" name='role' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option>Choose a role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="INVESTOR">Investor</option>
                            <option value="LANDLORD">Landlord</option>
                            <option value="TENANT">Tenant</option>
                        </select>
                    </div>
                    <div className='flex justify-between'>
                        <div></div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
                    </div>
                </form>

            </CustomModal>


            <CustomModal openModal={openDeleteModal} onCloseModal={() => setOpenDeleteModal(false)} isConfirm={true}>
                <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button onClick={() => setOpenDeleteModal(false)} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
                    <div className="flex justify-center items-center space-x-4">
                        <button data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                            No, cancel
                        </button>
                        <button onClick={(e) => handleDelete(e)} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            {deleting ? 'deleting...' : "Yes, I'm sure"}
                        </button>
                    </div>
                </div>
            </CustomModal>

        </>
    )
}

export default UserTable