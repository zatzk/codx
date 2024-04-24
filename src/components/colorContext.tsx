"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createContext, useState, useContext } from "react";
import { colorSets } from "./style/colors";

interface ColorSet {
  primary: string;
  secondary: string;
}


const ColorContext = createContext<any>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [activeColorSet, setActiveColorSet] = useState<ColorSet>(colorSets.blue);
  return (
    <ColorContext.Provider value={{ activeColorSet, setActiveColorSet }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColorContext() {
  return useContext(ColorContext);
}