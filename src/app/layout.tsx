// src\app\layout.tsx
import "~/styles/globals.css";
import { ColorProvider } from "~/lib/colorContext";
import {Providers} from "./providers";
import { TopNav } from "~/components/topNav";
import Background from "~/components/background";


export const metadata = {
  title: "CodX",
  description: "A Study Platform for Developers",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  return (
      <Providers>
        <ColorProvider>
            <html lang="en">
              <body className={`h-screen w-full flex justify-center bg-[#0f0f0f]`}>
                  <Background/>
                  <TopNav />
                  <main className="w-full absolute h-full flex justify-center">
                    {children}
                    {auth}
                    <div id="modal-root" />
                  </main>
              </body>
            </html>
        </ColorProvider>
      </Providers>
  );
}
