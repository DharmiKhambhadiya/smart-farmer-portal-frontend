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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading crops.</div>;

  const filteredCrops = selectedCategory
    ? data.filter((crop) => crop.category === selectedCategory)
    : data;

  return (
    <div className="crop-list p-6 md:p-10">
      <p className="mb-6 text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
        Welcome to the Plant Growing Guide from Smart Farmer. Click on a plant
        image to learn how to plant, grow, care, and manage pests and diseases.
      </p>

      {/* Categories */}
      <h1 className="text-2xl font-bold text-center mb-6">Categories</h1>
      <div className="flex justify-center flex-wrap gap-3 mb-10">
        <Categories onSelectCategory={setSelectedCategory} />
      </div>

      {/* Crop Cards */}
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <li
              key={crop._id}
              onClick={() => handleCropClick(crop._id)}
              className="cursor-pointer group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-52 object-cover transform group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <p className="mt-2 text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">
                  {crop.name}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center col-span-full text-gray-500">
            No crops found.
          </li>
        )}
      </ul>
    </div>
  );
};
