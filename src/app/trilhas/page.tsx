/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter } from "next/font/google";
import { useColorContext } from "../../components/style/colorContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function Trilhas() {
  const {activeColorSet} = useColorContext();

  return (
    <section className={`font-sans ${inter.variable}  flex min-h-screen flex-col items-center justify-center `}>
      <h1 className={`${activeColorSet?.secondary}`}>Trilhas</h1>
    </section>
  );
}
