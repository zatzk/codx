"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createContext, useState, useContext, useEffect } from "react";
import { colorSets } from "./style/colors";

interface ColorSet {
  primary: string;
  secondary: string;
}


const ColorContext = createContext<any>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [activeColorSet, setActiveColorSet] = useState<ColorSet>(
    () => {
      // Retrieve initial value from localStorage (if available)
      const storedColorSet = localStorage.getItem("activeColorSet");
      if (storedColorSet) {
        return JSON.parse(storedColorSet);
      }
      return colorSets.sky; // Default value
    }
  );

  useEffect(() => {
    if(typeof window !== "undefined") {
    localStorage.setItem("activeColorSet", JSON.stringify(activeColorSet));
    }
  }, [activeColorSet]);

  return (
    <ColorContext.Provider value={{ activeColorSet, setActiveColorSet }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColorContext() {
  return useContext(ColorContext);
}
