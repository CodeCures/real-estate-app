import DashboardLayout from '@/components/DashboardLayout';
import BreadCrumbComponent from '@/components/BreadCrumbComponent';
import { getProperties } from '@/services/properties.service';
import { currency } from '@/utils';


export default async function Page() {
    const { properties } = await getProperties();

    return (
        <DashboardLayout>
            <div className="w-[895px]" >
                <BreadCrumbComponent currentPage='Properties' />
                <div className=" flex justify-between flex-wrap gap-x-5 gap-y-2 items-center mb-10">
                    <h3 className=" font-semibold grow text-2xl text-gray-200">Properties</h3>
                    <div className="flex flex-wrap gap-2 items-center space-x-5">
                        <button
                            className=" bg-orange-500 hover:bg-orange-600 border-2 border-orange-500  grow min-w-[10rem] text-center text-white rounded-lg px-5 py-2.5 transition duration-300 ease-in-out flex space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            <span className="capitalize">Add New Property</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto lg:overflow-visible ">
                <table className="table text-gray-400 border-separate space-y-6 text-sm w-full">
                    <thead className="bg-gray-800 text-gray-500">
                        <tr>
                            <th className="p-3 text-left capitalize">ID</th>
                            <th className="p-3 text-left capitalize">location</th>
                            <th className="p-3 text-left capitalize">type</th>
                            <th className="p-3 text-left capitalize">purchase price</th>
                            <th className="p-3 text-left capitalize">current value</th>
                            <th className="p-3 text-left capitalize">(%)Appreciation Rate</th>
                            <th className="p-3 text-left capitalize">Rental Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property, index) => (
                            <tr key={property.id} className="bg-gray-800">

                                <td className="p-3 font-bold">
                                    #{index + 1}
                                </td>
                                <td className="p-3">
                                    {property.state}
                                </td>
                                <td className="p-3">
                                    {property.type}
                                </td>
                                <td className="p-3">
                                    {currency(property.purchasePrice)}
                                </td>
                                <td className="p-3">
                                    {currency(property.currentValue)}
                                </td>
                                <td className="p-3">
                                    {property.appreciationRate}
                                </td>
                                <td className="p-3">
                                    {property.rentalStatus}
                                </td>
                                {/* <td className="p-3 ">
                                    <Link href={`/property/${property.slug}`} className="text-gray-400 hover:text-gray-100 mr-2">
                                        <i className="material-icons-outlined text-base">View</i>
                                    </Link>
                                    <a href="#" className="text-gray-400 hover:text-gray-100  mx-2">
                                        <i className="material-icons-outlined text-base">edit</i>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-gray-100  ml-2">
                                        <i className="material-icons-round text-base">delete_outline</i>
                                    </a>
                                </td> */}
                            </tr>
                        ))}


                    </tbody>
                </table>
            </div>


            {/* <CustomModal openModal={openModal} onCloseModal={() => setOpenModal}>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                    companies around the world are updating their terms of service agreements to comply.
                </p>
            </CustomModal> */}
        </DashboardLayout>
    )
}

