/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/desafiosComponents/workspace.tsx
'use client';
import React from "react";
import { useState, useEffect } from "react";
import {
  type TestCaseProps,
  type DesafioProps,
} from "~/app/desafios/[id]/page";
import PreferenceNav from "./preferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { useLocalStorage } from "usehooks-ts";
import { useSession } from "next-auth/react";
import { useColorContext } from '~/lib/colorContext';
import EditorFooter from "./editorFooter";
import { Inter, Silkscreen } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

export default function Playground({ desafio }: { desafio: DesafioProps }) {
  const { data: session } = useSession();
  const {activeColorSet} = useColorContext();
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [userCode, setUserCode] = useState<string>(desafio.starterCode);
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [results, setResults] = useState<string[]>([]);
  const [resultsEvaluate, setResultsEvaluate] = useState<boolean | null>(null);
  const [resultsCount, setResultsCount] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"test" | "submit">("test");

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  const handleRunCode = async (
    userCode: string,
    testCases: string | unknown[],
    expectedOutputs: unknown[],
    functionName: string,
  ) => {
    const concatenatedInputs = JSON.stringify(testCases);
    const concatenatedExpectedOutputs = JSON.stringify(expectedOutputs);

    const codeToExecute = `
      ${userCode}
  
      process.stdin.on('data', function(data) {
        const inputs = JSON.parse(data.toString().trim());
        const expectedOutputs = JSON.parse(process.argv[2]);
        
        let count = 0;
        const results = inputs.map((inputArray, index) => {
          const outputArray = ${functionName}(inputArray);
          const outputString = JSON.stringify(outputArray);
          const expectedOutputString = JSON.stringify(expectedOutputs[index]);
  
          if (outputString === expectedOutputString) {
            count++;
          }
  
          return outputString;
        });
  
        const evaluate = count === inputs.length;
  
        console.log(JSON.stringify(results));
        console.log(count);
        console.log(evaluate);
      });
  
      process.stdin.resume();
    `;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          language: "javascript",
          version: "*",
          files: [
            {
              name: "script.js",
              content: codeToExecute,
            },
          ],
          stdin: concatenatedInputs,
          args: [concatenatedExpectedOutputs],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit code: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.run.code === 0) {
        const stdout = result.run.stdout.trim().split("\n");

        const resultsOutput = JSON.parse(stdout[0]).map((res: string) =>
          JSON.parse(res),
        );
        const resultsCount = parseInt(stdout[1], 10);
        const resultsEvaluate = stdout[2] === "true";

        return { resultsOutput, resultsCount, resultsEvaluate };
      } else {
        throw new Error(`Execution error: ${result.run.stderr}`);
      }
    } catch (error) {
      console.error("Failed to run code:", error);
      return {
        resultsOutput: Array(testCases.length).fill("undefined"),
        resultsCount: 0,
        resultsEvaluate: false,
      };
    }
  };

  const handleRun = async () => {
    const testCases = desafio.testCases
      .slice(0, 3)
      .map((testCase) => JSON.parse(testCase.input));
    const expectedOutputs = desafio.testCases
      .slice(0, 3)
      .map((testCase) => JSON.parse(testCase.expectedOutput));
    const { resultsOutput, resultsCount, resultsEvaluate } =
      await handleRunCode(
        userCode,
        testCases,
        expectedOutputs,
        desafio.functionName,
      );

    console.log("Results:", resultsOutput);
    setResults(resultsOutput);
    setShowResults(true);
    setActiveTab("test");
  };

  const handleSubmit = async () => {
    const testCases = desafio.testCases.map((testCase) =>
      JSON.parse(testCase.input),
    );
    const expectedOutputs = desafio.testCases.map((testCase) =>
      JSON.parse(testCase.expectedOutput),
    );
    const { resultsOutput, resultsCount, resultsEvaluate } =
      await handleRunCode(
        userCode,
        testCases,
        expectedOutputs,
        desafio.functionName,
      );

    console.log("Submit Results:", resultsOutput);
    setResults(resultsOutput);
    setResultsEvaluate(resultsEvaluate);
    setResultsCount(resultsCount);
    setShowResults(true);
    setActiveTab("submit");
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${JSON.stringify(session)}`);
    if (session) {
      setUserCode(code ? JSON.parse(code) : desafio.starterCode);
    } else {
      setUserCode(desafio.starterCode);
    }
  }, [session, desafio.starterCode]);

  const onChange = (value: string) => {
    setUserCode(value);
    if (session) {
      localStorage.setItem(
        `code-${JSON.stringify(session)}`,
        JSON.stringify(value),
      );
    }
  };

  console.log("session", session);
  console.log("desafio playground", desafio);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg">
      
      <Split
        className="h-[calc(100vh-235px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="border rounded-lg flex flex-col justify-between">
          <div className={`flex min-h-9 h-9 items-center rounded-t-lg bg-opacity-50 ${activeColorSet?.bg}`}>
            <div className={`${silkscreen.className} text-sm ml-4`}>Source code</div>
          </div>
          <PreferenceNav />
          <div className="flex w-full flex-col justify-between overflow-auto">
            <CodeMirror
              value={userCode}
              theme={githubDark}
              onChange={onChange}
              extensions={[javascript()]}
              style={{ fontSize: settings.fontSize }}
            />
            <EditorFooter onRun={handleRun} onSubmit={handleSubmit} />
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-lg border flex flex-col">


          <div className={`absolute z-10 flex h-9 w-full items-center bg-opacity-50 justify-start rounded-t-lg ${activeColorSet?.bg}`}>
            <div className={`${silkscreen.className} ml-4`}>
              <button
                className={`mr-2 rounded-md px-2 py-1 text-xs hover:border ${activeTab === "test" ? "font-bold" : ""}`}
                onClick={() => setActiveTab("test")}
              >
                Test Result
              </button>
              <button
                className={`mr-2 rounded-md px-2 py-1 text-xs hover:border ${activeTab === "submit" ? "font-bold" : ""}`}
                onClick={() => setActiveTab("submit")}
              >
                Submit Result
              </button>
            </div>
          </div>



          <div className="overflow-x-hidden h-full mt-9 overflow-y-auto">
            {activeTab === "test" && (
              <div className="ml-3 flex h-10 flex-col items-start">
                <div className="flex">
                  {desafio?.examples?.map((example, index) => {
                    const isMatched =
                      showResults &&
                      JSON.stringify(results[index]) ===
                        JSON.stringify(
                          JSON.parse(desafio?.examples[index]?.outputText ?? ""),
                        );

                    return (
                      <div
                        className="mr-2 mt-2 items-start"
                        key={example?.id}
                        onClick={() => setActiveTestCaseId(index)}
                      >
                        <div className="flex flex-wrap items-center gap-y-4">
                          <div
                            className={`relative inline-flex cursor-pointer items-center whitespace-nowrap rounded-lg px-4 py-1 font-medium transition-all focus:outline-none ${
                              activeTestCaseId === index
                                ? "text-white"
                                : "text-gray-500"
                            } hover:border hover:text-white`}
                          >
                            {showResults && (
                              <span
                                className={`mr-1 flex items-center text-xs ${
                                  isMatched ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                •
                              </span>
                            )}
                            Case {index + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="ml-4 w-full pb-10 font-semibold">
                  <p className="ml-1 mt-4 text-xs font-medium text-white">
                    Input:
                  </p>
                  <div className="mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white">
                    {desafio?.examples?.[activeTestCaseId]?.inputText
                      .split("=")
                      .map(
                        (
                          part:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<unknown>
                              >
                            | Iterable<React.ReactNode>
                            | Promise<React.AwaitedReactNode>
                            | null
                            | undefined,
                          index: React.Key | null | undefined,
                        ) => (
                          <React.Fragment key={index}>
                            {index === 0 ? (
                              <span className="text-xs">{part} =</span>
                            ) : (
                              <span>
                                <br />
                                {part?.toString().trim() ?? ''}
                              </span>
                            )}
                          </React.Fragment>
                        ),
                      )}
                  </div>
                  {showResults && (
                    <div className="w-full overflow-auto">
                      <div className="ml-1 mt-4 text-xs font-medium text-white">
                        Output:
                      </div>
                      <div
                        className={`mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white`}
                      >
                        <div>{JSON.stringify(results[activeTestCaseId])}</div>
                      </div>
                    </div>
                  )}
                  <p className="ml-1 mt-4 text-xs font-medium text-white">
                    Expected:
                  </p>
                  <div className="mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white">
                    {desafio?.examples?.[activeTestCaseId]?.outputText}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "submit" && (
              <div className="ml-3 mt-10 flex h-10 flex-col items-start">
                {resultsEvaluate !== null ? (
                  <>
                    <div className="ml-3 mt-3 flex flex-row items-center">
                      <h2
                        className={`text-2xl font-bold ${resultsEvaluate ? "text-green-500" : "text-red-500"}`}
                      >
                        {resultsEvaluate ? "Correct Answer" : "Wrong Answer"}
                      </h2>
                      <p className="ml-3 text-xs text-[#787867]">
                        {`| ${resultsCount}/${desafio.testCases.length} testcases passed`}
                      </p>
                    </div>

                    <div className="ml-4 w-full font-semibold">
                      <p className="ml-1 mt-4 text-xs font-medium text-white">
                        Input:
                      </p>
                      <div className="mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white">
                        {desafio?.examples?.[0]?.inputText
                          .split("=")
                          .map((part: string, index: number) => (
                            <React.Fragment key={index}>
                              {index === 0 ? (
                                <span className="text-xs">{part} =</span>
                              ) : (
                                <span>
                                  <br />
                                  {part.trim()}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                      </div>

                      <p className="ml-1 mt-4 text-xs font-medium text-white">
                        Output:
                      </p>
                      <div className="mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white">
                        {JSON.stringify(results[0])}
                      </div>

                      <p className="ml-1 mt-4 text-xs font-medium text-white">
                        Expected Output:
                      </p>
                      <div className="mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white">
                        {desafio?.examples?.[0]?.outputText}
                      </div>
                    </div>

                    <div className="ml-4 w-full pb-10 font-semibold">
                      <p className="ml-1 mt-4 text-xs font-medium text-white">
                        Code:
                      </p>
                      <div className="mt-2 w-[90%] cursor-text rounded-lg border px-3 py-[10px] text-white">
                        <pre>{userCode}</pre>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="ml-4 w-full pb-10 font-semibold text-white">
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Split>
    </div>
  );
}
