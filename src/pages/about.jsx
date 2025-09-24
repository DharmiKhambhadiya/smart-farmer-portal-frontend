import { useQuery } from "@tanstack/react-query";
import { getCrops } from "../compopnents/services/API/cropapi";
import { useNavigate } from "react-router-dom";
import { Categories } from "../compopnents/categories";
import { useState } from "react";

export const About = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["crops"],
    queryFn: getCrops,
  });

  const handleCropClick = (id) => {
    navigate(`/about/${id}`);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
        <div className="w-16 h-16 border-4 border-t-transparent border-emerald-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-800 text-lg font-medium text-center">
          Loading crops, please wait...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-600"
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
        <h2 className="text-xl font-bold text-red-700 mb-2 text-center">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-700 text-center max-w-md">
          We couldn't load the crops. Please check your connection and try
          again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );

  const filteredCrops = selectedCategory
    ? data.filter((crop) => crop.category === selectedCategory)
    : data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50">
      {/* Hero Section with Video Background */}
      {/* Hero Section with Video Background */}
      <div className="relative bg-gradient-to-b from-emerald-100 to-transparent overflow-hidden h-[360px] md:h-[520px]">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>

        {/* Gradient + vignette overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-0"></div>
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Content removed as requested: keeping video only */}

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-30 blur-xl z-0"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-xl z-0"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Categories Section */}
        <div className="mb-12 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200/50">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
            Browse by Category
          </h2>
          <div className="flex justify-center">
            <Categories onSelectCategory={setSelectedCategory} />
          </div>
        </div>

        {/* Crop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
          {filteredCrops.length > 0 ? (
            filteredCrops.map((crop) => (
              <div
                key={crop._id}
                onClick={() => handleCropClick(crop._id)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-emerald-100"
                role="button"
                tabIndex={0}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleCropClick(crop._id)
                }
                aria-label={`Learn how to grow ${crop.name}`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={crop.imageUrl || "/placeholder-plant.jpg"}
                    alt={crop.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/fallback-plant.png")}
                  />
                  <div className="absolute top-3 right-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10">
                    <span className="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                      {crop.category}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="p-4 pt-3 min-h-[60px] flex items-center">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 text-center leading-tight line-clamp-2 w-full">
                    {crop.name}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-xl p-10 text-center border border-gray-200 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.827-6.18-2.182M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="text-base font-semibold text-gray-800 mb-2 text-center">
                  No crops found
                </h3>
                <p className="text-gray-600 text-sm">
                  Try selecting a different category.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
