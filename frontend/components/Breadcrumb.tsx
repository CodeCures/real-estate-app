'use client';

const Breadcrumb = ({ crumbs }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {crumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="inline-flex items-center text-sm font-medium  text-gray-300 hover:text-white"
              >
                {crumb.icon && (
                  <span className="me-2.5">
                    {crumb.icon} {/* Render the full icon tag */}
                  </span>
                )}
                {crumb.label}
              </a>
            ) : (
              <span className="ms-1 text-sm font-medium  md:ms-2 text-gray-300">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
