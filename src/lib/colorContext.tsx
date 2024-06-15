/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createContext, useContext } from "react";
import { colorSets } from "./colors";
import { useLocalStorage } from "usehooks-ts";

interface ColorSet {
  primary: string;
  secondary: string;
  barHover: string;
  bg: string;
  borderButton: string;
}


const ColorContext = createContext<any>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [activeColorSet, setActiveColorSet] = useLocalStorage<ColorSet>(
    "activeColorSet",
    colorSets.white,
    {initializeWithValue: false}
  );


  return (
    <ColorContext.Provider value={{ activeColorSet, setActiveColorSet }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColorContext() {
  return useContext(ColorContext);
}
