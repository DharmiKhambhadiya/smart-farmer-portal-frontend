export const Cropcard = ({ crop }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section: Image + Key Facts Side-by-Side */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Image */}
        <div className="lg:w-2/3 flex-shrink-0">
          <img
            src={crop.imageUrl || "/placeholder-plant.jpg"}
            alt={crop.name}
            className="w-full h-auto object-cover rounded-xl shadow-md"
            loading="lazy"
          />
        </div>

        {/* Right: Key Facts */}
        <div className="lg:w-1/3 bg-gray-50 p-5 rounded-xl shadow-sm space-y-3">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">
            {crop.name}
          </h2>

          <div className="text-sm space-y-2">
            {[
              { label: "Type", value: crop.plantType },
              { label: "Sun Exposure", value: crop.sunExposure },
              { label: "Soil pH", value: crop.soilPH },
              { label: "Bloom Time", value: crop.bloomTime || "N/A" },
              { label: "Flower Color", value: crop.flowerColor || "N/A" },
              { label: "Category", value: crop.category },
            ].map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium text-gray-600">{item.label}:</span>
                <span className="text-gray-800 ml-2">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview */}
      {crop.overview && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Overview</h3>
          <p className="text-gray-700 leading-relaxed">{crop.overview}</p>
        </div>
      )}

      {/* Planting Info */}
      {crop.lifecycle?.planting && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🌱 Planting Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Season:</strong> {crop.lifecycle.planting.season}
            </p>
            <p>
              <strong>Seed Depth:</strong> {crop.lifecycle.planting.seedDepth}
            </p>
            <p>
              <strong>Spacing:</strong> Row -{" "}
              {crop.lifecycle.planting.spacing?.row || "N/A"}, Plant -{" "}
              {crop.lifecycle.planting.spacing?.plant || "N/A"}
            </p>
            <p>
              <strong>Sowing Tips:</strong> {crop.lifecycle.planting.sowingTips}
            </p>
          </div>
        </div>
      )}

      {/* Growing Info */}
      {crop.lifecycle?.growing && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🌿 Growing & Care
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Irrigation Needs:</strong>{" "}
              {crop.lifecycle.growing.irrigationNeeds}
            </p>
            <p>
              <strong>Fertilizer:</strong> {crop.lifecycle.growing.fertilizer}
            </p>
            {crop.lifecycle.growing.careTips?.length > 0 && (
              <>
                <strong>Care Tips:</strong>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {crop.lifecycle.growing.careTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pests and Diseases */}
      {crop.pestsAndDiseases?.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🐛 Pests & Diseases
          </h3>
          <div className="space-y-5">
            {crop.pestsAndDiseases.map((pd, i) => (
              <div key={i} className="border-l-4 border-red-400 pl-4 py-2">
                <p className="font-medium text-gray-800">
                  {pd.name} ({pd.type})
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Symptoms:</strong> {pd.symptoms}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Solution:</strong> {pd.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
