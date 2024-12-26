import LineChart from '@/components/LineChart';
import BarChart from '@/components/BarChart';
import DashboardLayout from '@/components/DashboardLayout';
import { getDashboardStats } from '@/services/app.service';
import StatCards from '@/components/StatCards';
import { currency, getGreeting } from '@/utils';

export default async function Page() {
    const { lineChart, barChart, stats, history } = await getDashboardStats()

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-black text-gray-300">{getGreeting()}</h1>
            <p className="mb-6 text-gray-500">Here's an overview of your monthly transactions.</p>
            {stats && (
                <>
                    <StatCards stats={stats} />

                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-8 mt-10">

                        <div className="h-fit  rounded-xl bg-gray-200 p-10 shadow-md">
                            <LineChart data={lineChart} />
                        </div>
                        <div className="h-fit  rounded-xl bg-gray-200 p-10 shadow-md">
                            <BarChart data={barChart} />
                        </div>
                    </div>
                    <section className='mt-10 space-y-14'>
                        <div className="overflow-auto lg:overflow-visible space-y-3 ">
                            <div className=" flex justify-between flex-wrap gap-x-5 gap-y-2 items-center">
                                <h3 className=" font-semibold grow text-2xl text-gray-200">Recent Expenses</h3>
                            </div>
                            <table className="table text-gray-400 border-separate space-y-6 text-sm w-full">
                                <thead className="bg-gray-800 text-gray-500">
                                    <tr>
                                        <th className="p-3">Property</th>
                                        <th className="p-3 text-left">Property Type</th>
                                        <th className="p-3 text-left">Expenses</th>
                                        <th className="p-3 text-left">Vendor</th>
                                        <th className="p-3 text-left">Amount</th>
                                        <th className="p-3 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history?.expenses.map((exp, index) => (
                                        <tr key={index} className="bg-gray-800">
                                            <td className="p-3">{exp.propertyName}</td>
                                            <td className="p-3">{exp.propertyType}</td>
                                            <td className="p-3">{exp.type}</td>
                                            <td className="p-3">{exp.vendor}</td>
                                            <td className="p-3">{currency(exp.amount)}</td>
                                            <td className="p-3">{exp.date}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                        <div className="overflow-auto lg:overflow-visible space-y-3">
                            <div className=" flex justify-between flex-wrap gap-x-5 gap-y-2 items-center">
                                <h3 className=" font-semibold grow text-2xl text-gray-200">Performance History</h3>
                            </div>
                            <table className="table text-gray-400 border-separate space-y-6 text-sm w-full">
                                <thead className="bg-gray-800 text-gray-500">
                                    <tr>
                                        <th className="p-3">Property</th>
                                        <th className="p-3 text-left">Income</th>
                                        <th className="p-3 text-left">(%) Occupancy Rate</th>
                                        <th className="p-3 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history?.propertyPerformanceReports.map((r, i) => (
                                        <tr key={i} className="bg-gray-800">
                                            <td className="p-3">
                                                <div className="flex align-items-center">
                                                    <img className="rounded-full h-12 w-12  object-cover" src="https://images.unsplash.com/photo-1613588718956-c2e80305bf61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80" alt="unsplash image" />
                                                    <div className="ml-3">
                                                        <div className="">{r.propertyName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">{currency(r.netIncome)}</td>
                                            <td className="p-3">
                                                <span className={`${r.occupancyRate < 70 ? (r.occupancyRate < 50 ? 'bg-red-400' : 'bg-yellow-400') : 'bg-green-400'} text-gray-50 rounded-md px-2`}>{r.occupancyRate}</span>
                                            </td>
                                            <td className="p-3 ">
                                                <a href="#" className="text-gray-400 hover:text-gray-100 mr-2">
                                                    <i className="material-icons-outlined text-base">{r.date}</i>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}

        </DashboardLayout>
    )
}




