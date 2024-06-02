/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Inter } from "next/font/google";
import { useColorContext } from "../../components/style/colorContext"
import { SimplePagHeader } from "~/components/simplePageHeader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function Questoes() {
  const {activeColorSet} = useColorContext();

  return (
    <section className={`font-sans ${inter.variable} ${activeColorSet?.secondary} flex min-h-screen w-full flex-col items-center mt-20 `}>
      <SimplePagHeader title="Questões" description="Quizzes to help you test and improve your knowledge and skill up" />
      <h1 className={``}>Teste</h1>
    </section>
  );
}
