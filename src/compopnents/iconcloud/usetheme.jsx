// src/components/IconCloud/use-theme.js
import { useState } from "react";

export const useTheme = () => {
  const [color, setColor] = useState("#22C55E"); // Emerald green to match your theme
  return { color, setColor };
};
