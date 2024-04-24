/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Fira_Code } from "next/font/google";
import { Inter } from "next/font/google";
import { HelloWorld } from "~/components/ui/helloWorld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
// const firaCode = Fira_Code({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });



export default function HomePage() {
  // const {activeColorSet} = useColorContext();

  return (
    <section className={`font-sans ${inter.variable} flex min-h-screen flex-col items-center justify-center `}>
      <HelloWorld />
    </section>
  );
}
