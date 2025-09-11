export const Cropcard = ({ crop }) => {
  return (
    <>
      <li key={crop._id} className="crop-item">
        <img src={crop.imageUrl} alt={crop.name} width={200} />
        <h2>{crop.name}</h2>
        <p>
          <strong>Type:</strong> {crop.plantType}
        </p>
        <p>
          <strong>Sun Exposure:</strong> {crop.sunExposure}
        </p>
        <p>
          <strong>Soil pH:</strong> {crop.soilPH}
        </p>
        <p>
          <strong>Bloom Time:</strong> {crop.bloomTime || "N/A"}
        </p>
        <p>
          <strong>Flower Color:</strong> {crop.flowerColor || "N/A"}
        </p>
        <p>
          <strong>Category:</strong> {crop.category}
        </p>
        <p>
          <strong>Overview:</strong> {crop.overview}
        </p>

        {/* Lifecycle - Planting Details */}
        {crop.lifecycle?.planting && (
          <>
            <h3>Planting Info</h3>
            <p>
              <strong>Season:</strong> {crop.lifecycle.planting.season}
            </p>
            <p>
              <strong>Seed Depth:</strong> {crop.lifecycle.planting.seedDepth}
            </p>
            <p>
              <strong>Spacing:</strong> Row -{" "}
              {crop.lifecycle.planting.spacing?.row}, Plant -{" "}
              {crop.lifecycle.planting.spacing?.plant}
            </p>
            <p>
              <strong>Sowing Tips:</strong> {crop.lifecycle.planting.sowingTips}
            </p>
          </>
        )}

        {/* Lifecycle - Growing Details */}
        {crop.lifecycle?.growing && (
          <>
            <h3>Growing Info</h3>
            <p>
              <strong>Irrigation Needs:</strong>{" "}
              {crop.lifecycle.growing.irrigationNeeds}
            </p>
            <p>
              <strong>Fertilizer:</strong> {crop.lifecycle.growing.fertilizer}
            </p>
            <ul>
              {crop.lifecycle.growing.careTips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </>
        )}

        {/* Pests and Diseases */}
        {crop.pestsAndDiseases?.length > 0 && (
          <>
            <h3>Pests and Diseases</h3>
            {crop.pestsAndDiseases.map((pd, i) => (
              <div key={i}>
                <p>
                  <strong>{pd.type}:</strong> {pd.name}
                </p>
                <p>
                  <strong>Symptoms:</strong> {pd.symptoms}
                </p>
                <p>
                  <strong>Solution:</strong> {pd.solution}
                </p>
              </div>
            ))}
          </>
        )}
      </li>
    </>
  );
};
