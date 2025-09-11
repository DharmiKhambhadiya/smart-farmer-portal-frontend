import { useQuery } from "@tanstack/react-query";
import { getCategory } from "./services/API/cropapi";
import { useState } from "react";

export const Categories = ({ onSelectCategory }) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  const [activeCategory, setActiveCategory] = useState(null);

  if (isLoading) return <div>Loading.....</div>;
  if (isError) return <div>Error Loading...</div>;

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    onSelectCategory(cat);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* All Button */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={`px-6 py-2 rounded-full font-medium transition 
          ${
            activeCategory === null
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white"
          }`}
      >
        All
      </button>

      {/* Dynamic Categories */}
      {data.map((cat, index) => (
        <button
          key={index}
          onClick={() => handleCategoryClick(cat)}
          className={`px-6 py-2 rounded-full font-medium transition 
            ${
              activeCategory === cat
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
