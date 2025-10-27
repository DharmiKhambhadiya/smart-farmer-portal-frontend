// src/components/IconCloud/index.js
export const cloudProps = {
  canvasProps: {
    style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  },
  containerProps: {
    style: { position: "relative", width: "100%", height: "100%" }, // Full container
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 1.5, // Larger icons
    activeCursor: "pointer",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    radius: 150, // Larger radius for visible cloud
  },
};
