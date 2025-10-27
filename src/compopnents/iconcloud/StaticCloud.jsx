import { Cloud } from "react-icon-cloud";

const farmingIcons = [
  { slug: "tractor", src: "/images/i1.png", title: "Tractor", href: "#" },
  { slug: "seedling", src: "/images/i2.png", title: "Seedling", href: "#" },
  { slug: "corn", src: "/images/i3.png", title: "Corn", href: "#" },
  { slug: "wheat", src: "/images/i4.png", title: "Wheat", href: "#" },
  { slug: "farm", src: "/images/i5.png", title: "Farm", href: "#" },
  { slug: "farm", src: "/images/i6.png", title: "Farm", href: "#" },
  { slug: "farm", src: "/images/i7.png", title: "Farm", href: "#" },
  { slug: "farm", src: "/images/i8.png", title: "Farm", href: "#" },
  { slug: "farm", src: "/images/i9.png", title: "Farm", href: "#" },
  { slug: "farm", src: "/images/i10.png", title: "Farm", href: "#" },
];

export const StaticCloud = () => (
  <div className="w-full max-w-[400px] h-[300px] overflow-hidden flex items-center justify-center rounded-xl bg-transparent">
    <Cloud
      containerProps={{ style: { width: "100%", height: "100%" } }}
      options={{
        radius: 150,
        maxSpeed: 0.05,
        initial: [0.1, -0.1],
        imageScale: 2,
        depth: 1,
        outlineColour: "#059669", // emerald-600 for outline
      }}
    >
      {farmingIcons.map((icon) => (
        <a
          key={icon.slug + icon.src}
          href={icon.href}
          title={icon.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            height="40"
            width="40"
            alt={icon.title}
            src={icon.src}
            loading="lazy"
            className="rounded-lg border border-emerald-200 bg-transparent"
            onError={(e) => (e.target.style.display = "none")}
          />
        </a>
      ))}
    </Cloud>
  </div>
);
