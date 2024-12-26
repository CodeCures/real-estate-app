
import Link from "next/link";
import RegistrationForm from "@/components/RegisterationForm";
export default function Page() {

  return (
    <div className="bg-gray-900 min-h-screen flex box-border justify-center items-center">
      <div className="mx-auto container flex items-center" id="nav">
        <div className="w-full pt-2 p-4">
          <div className="mx-auto md:p-6 md:w-2/5">
            <div className="flex flex-wrap justify-between">
              <h1 className="text-2xl text-orange-500 hover:text-orange-500 transition duration-500 p-4">
                <i className="fas fa-sign-in-alt fa-fw fa-lg"></i>
                Sign-Up
              </h1>
              <Link
                href="/"
                className="mt-8 text-orange-400 hover:text-orange-600 transition duration-500"
              >
                <svg
                  className=" w-6 h-6 inline-block align-bottom"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Back to Home
                <i className="fas fa-chevron-circle-left fa-fw"></i>
              </Link>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
             <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
