/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
// import { Fira_Code } from "next/font/google";
import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useColorContext } from "~/components/style/colorContext";
import { type colorSets } from "~/components/style/colors";
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
  const {activeColorSet} = useColorContext();
  const interactiveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const MoveInCircle = keyframes`
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `
  const MoveVertical = keyframes`
    0% {
      transform: translateY(-50%);
    }
    50% {
      transform: translateY(50%);
    }
    100% {
      transform: translateY(-50%);
    }
  `
  const MoveHorizontal = keyframes`
    0% {
      transform: translateX(-50%) translateY(-10%);
    }
    50% {
      transform: translateX(50%) translateY(10%);
    }
    100% {
      transform: translateX(-50%) translateY(-10%);
    }
  `

  const GradientBg = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(farthest-corner at 65vw 100vh, rgb(${activeColorSet.gradientBg}) 0%, transparent 100%)`
      : `radial-gradient(farthest-corner at 65vw 100vh, rgb(219, 39, 119) 0%, transparent 100%)`};
    /* background: ${({ activeColorSet }) =>
      activeColorSet ? `linear-gradient(40deg, rgb(${activeColorSet.gradientBg}) 0%, transparent 100%)`
      : `linear-gradient(40deg, rgb(219, 39, 119) 0%, transparent 100%)`}; */
    overflow: hidden;
    top: 0;
    left: 0;
    opacity: 80%;

    svg {
      display: none;
    }
  `
  const GradientsContainer = styled.div`
    filter: url(#goo) blur(40px);
    width: 100%;
    height: 100%;
  `;
  const G1 = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    position: absolute;
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(circle at center, rgba(${activeColorSet.g1}, 0.8) 0, rgba(${activeColorSet.g1}, 0) 50%) no-repeat` 
      : `radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0, rgba(18, 113, 255, 0) 50%) no-repeat`};
    mix-blend-mode: hard-light;
    
    width: 80%;
    height: 80%; 
    top: calc(50% - 80% / 2);
    left: calc(50% - 80% / 2);
    transform-origin: center center;
    animation: ${MoveVertical} 30s ease infinite;

    opacity: 1;
  `;
  const G2 = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    position: absolute;
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(circle at center, rgba(${activeColorSet.g2}, 0.8) 0, rgba(${activeColorSet.g2}, 0) 50%) no-repeat` 
      : `radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0, rgba(221, 74, 255, 0) 50%) no-repeat`};
    mix-blend-mode: hard-light;

    width: 80%;
    height: 80%; 
    top: calc(50% - 80% / 2);
    left: calc(50% - 80% / 2);
    transform-origin: calc(50% - 400px);
    animation: ${MoveInCircle} 20s reverse infinite;

    opacity: 1;
  `;
  const G3 = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    position: absolute;
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(circle at center, rgba(${activeColorSet.g3}, 0.8) 0, rgba(${activeColorSet.g3}, 0) 50%) no-repeat` 
      : `radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0, rgba(100, 220, 255, 0) 50%) no-repeat`};
    mix-blend-mode: hard-light;

    width: 80%;
    height: 80%; 
    top: calc(50% - 80% / 2);
    left: calc(50% - 80% / 2);
    transform-origin: calc(50% + 400px);
    animation: ${MoveInCircle} 40s linear infinite;

    opacity: 1;
  `;
  const G4 = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    position: absolute;
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(circle at center, rgba(${activeColorSet.g4}, 0.8) 0, rgba(${activeColorSet.g4}, 0) 50%) no-repeat` 
      : `radial-gradient(circle at center, rgba(200, 50, 50, 0.8) 0, rgba(200, 50, 50, 0) 50%) no-repeat`};
    mix-blend-mode: hard-light;

    width: 80%;
    height: 80%; 
    top: calc(50% - 80% / 2);
    left: calc(50% - 80% / 2);
    transform-origin: calc(50% - 200px);
    animation: ${MoveHorizontal} 40s ease infinite;

    opacity: 1;
  `;
  const G5 = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    position: absolute;
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(circle at center, rgba(${activeColorSet.g5}, 0.8) 0, rgba(${activeColorSet.g5}, 0) 50%) no-repeat` 
      : `radial-gradient(circle at center, rgba(180, 180, 50, 0.8) 0, rgba(180, 180, 50, 0) 50%) no-repeat`};
    mix-blend-mode: hard-light;

    width: 80%;
    height: 80%; 
    top: calc(50% - 80% / 2);
    left: calc(50% - 80% / 2);
    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: ${MoveInCircle} 20s ease infinite;

    opacity: 1;
  `;
  const Interactive = styled.div<{ activeColorSet?: typeof colorSets[keyof typeof colorSets] }>`
    position: absolute;
    background: ${({ activeColorSet }) =>
      activeColorSet ? `radial-gradient(circle at center, rgba(${activeColorSet.interactive}, 0.8) 0, rgba(${activeColorSet.interactive}, 0) 50%) no-repeat` 
      : `radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0, rgba(140, 100, 255, 0) 50%) no-repeat`};
    mix-blend-mode: hard-light;
    width: 100%;
    height: 100%;
    pointer-events: none;
    /* transform: translate(-50%, -50%); */
    top: -50%;
    left: -50%;
    opacity: 0.7;
    transition: transform 0.1s ease-out;
  `;
  

  return (
    <>
      <GradientBg activeColorSet={activeColorSet} className="w-screen h-screen absolute transition-all duration-1000"> 
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <GradientsContainer>
          <G1 activeColorSet={activeColorSet}></G1>
          <G2 activeColorSet={activeColorSet}></G2>
          <G3 activeColorSet={activeColorSet}></G3>
          <G4 activeColorSet={activeColorSet}></G4>
          <G5 activeColorSet={activeColorSet}></G5>
          <Interactive ref={interactiveRef} activeColorSet={activeColorSet}></Interactive>
        </GradientsContainer>
      </GradientBg>
      <section className={`font-sans ${inter.variable} absolute flex h-screen w-screen flex-col items-center justify-center `}>
        <HelloWorld />
      </section>
    </>
  );
}
