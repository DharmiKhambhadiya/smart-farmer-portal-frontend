import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { getCrop } from "../compopnents/services/API/cropapi";
import { Cropcard } from "../compopnents/cropcard";

export const Singlecrop = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const {
    data: crop,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singlecrop", id],
    queryFn: () => getCrop(id),
  });

  // ✅ Handler for back button
  const handleBack = () => {
    navigate(-1); // Go back in history
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-8">
      {/* ✅ Back Button - Top Left */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-2"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Loading Crop Details...
            </h2>
            <p className="text-gray-500">
              We’re fetching the latest information about your crop.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-700">
              Something went wrong
            </h2>
            <p className="text-gray-600">
              We couldn’t load the crop details. Please check your connection or
              try again later.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Success State */}
      {crop && (
        <div className="max-w-4xl mx-auto w-full animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            {/* Optional: Hero Image Placeholder (if you add image support later) */}
            {/* <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div> */}

            <div className="p-6 md:p-8">
              <Cropcard key={crop._id} crop={crop} />
            </div>

            {/* Subtle bottom accent bar */}
            <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
          </div>
        </div>
      )}
    </div>
  );
};
