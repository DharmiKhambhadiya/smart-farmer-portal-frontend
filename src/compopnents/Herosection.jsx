import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-b from-green-100 to-transparent py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/images/farmer-field.png')" }}
      >
        {/* Gradient overlay for strong contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        {/* Vignette for cinematic look */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 text-left text-white">
        <div className="p-6 md:p-10 ml-0 md:ml-4 bg-black/30 backdrop-blur-md rounded-2xl inline-block shadow-2xl ring-1 ring-white/10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
            Grow Smarter with Smart Farmer
          </h1>
          <p className="text-lg md:text-2xl mb-6 text-gray-100/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
            Discover premium farming tools and resources for a thriving harvest
          </p>
          <button
            onClick={() => navigate("/about")}
            className="bg-white text-green-700 px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
          >
            Explore Plants
          </button>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute top-10 -left-10 w-48 h-48 bg-green-300/30 rounded-full opacity-40 blur-2xl animate-pulse" />
      <div className="absolute bottom-10 -right-10 w-56 h-56 bg-blue-300/30 rounded-full opacity-40 blur-2xl" />
    </div>
  );
};
