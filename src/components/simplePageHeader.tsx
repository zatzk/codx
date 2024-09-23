/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inter, Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface SimplePagHeaderProps {
  title: string
  description: string
}
export function SimplePagHeader( props: SimplePagHeaderProps ) {

  return (
    <div className={`w-2/3 border rounded-2xl px-3 py-3 ${silkscreen.className}`}>
      <div className="px-[1rem]">
      <h1 className={`text-white text-md `}>{props.title}</h1>
      <p className={`text-gray-400 text-sm ${inter.className}`}>{props.description}</p>
      </div>
    </div>
  )
}