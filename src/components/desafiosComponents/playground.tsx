/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/desafiosComponents/workspace.tsx
import React from "react";
import { useState, useEffect } from "react";
import { type TestCaseProps, type DesafioProps } from "~/app/desafios/[id]/page";
import PreferenceNav from "./preferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { useLocalStorage } from "usehooks-ts";
import { useSession } from "next-auth/react";
import EditorFooter from "./editorFooter";

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

export default function Playground({ desafio }: { desafio: DesafioProps }) {
  const { data: session } = useSession();
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [userCode, setUserCode] = useState<string>(desafio.starterCode);
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  const handleRunCode = async (userCode, testCases, functionName) => {
    const inputs = testCases.map(testCase => JSON.parse(testCase.input));
    const concatenatedInputs = JSON.stringify(inputs);
    console.log("Concatenated inputs:", concatenatedInputs);

    const codeToExecute = `
      ${userCode}

      process.stdin.on('data', function(data) {
        const inputs = JSON.parse(data.toString().trim());
        const results = inputs.map(inputArray => {
          const outputArray = ${functionName}(inputArray);
          return JSON.stringify(outputArray);
        });
        results.forEach(result => console.log(result));
      });

      process.stdin.resume();
  `;
  
    console.log("Running code handleRunCode:", codeToExecute);
  
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          language: "javascript",
          version: "*", // Use the latest version available
          files: [{
            name: "script.js",
            content: codeToExecute
          }],
          stdin: concatenatedInputs,
          // args: testCase.expectedOutput,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit code: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Execution status:", result);
  
      if (result.run.code === 0) {
        console.log("Execution result:", result.run.stdout);
        return result.run.stdout;
      } else {
        return `Error: ${result.run.stderr}`;
      }
    } catch (error) {
      console.error("Failed to run code:", error);
      return "Error";
    }
  };
  
  const handleRun = async () => {
    console.log("Running code handleRun:", userCode);
    const testCases = desafio.testCases;
    const result = await handleRunCode(userCode, testCases, desafio.functionName);
    setResults([result]);
    setShowResults(true);
  };

  const handleSubmit = async () => {
    console.log("Running code...");
    const allResults = await Promise.all(
      desafio.testCases.map((testCase) => handleRunCode(userCode, testCase, desafio.functionName))
    );
    console.log("Results:", allResults);
    setResults(allResults);
    setShowResults(true);
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
      localStorage.setItem(`code-${JSON.stringify(session)}`, JSON.stringify(value));
    }
  };

  console.log("session", session);
  console.log("desafio playground", desafio);

  return (
     <div className="relative flex flex-col overflow-x-hidden bg-[#282828]">
      <PreferenceNav />
      <Split className="h-[calc(100vh-160px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
          />
        </div>
        <div className="w-full overflow-auto px-5">
          <div className="flex flex-col items-start h-10 ">
            <div className="relative flex h-fullcursor-pointer flex-col justify-center">
              <div className="text-sm font-medium leading-5 text-white">Testcases</div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
            <div className="flex">
              {desafio?.examples?.map((example, index) => (
                <div
                  className="mr-2 mt-2 items-start "
                  key={example?.id}
                  onClick={() => setActiveTestCaseId(index)}
                >
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div
                      className={`bg-dark-fill-3 hover:bg-dark-fill-2 relative inline-flex cursor-pointer items-center whitespace-nowrap rounded-lg px-4 py-1 font-medium transition-all focus:outline-none
                      ${activeTestCaseId === index ? "text-white" : "text-gray-500"}`}
                    >
                      Case {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-4 font-semibold">
              <p className="mt-4 text-sm font-medium text-white">Input:</p>
              <div className="bg-dark-fill-3 mt-2 w-full cursor-text rounded-lg border border-transparent px-3 py-[10px] text-white">
                {desafio?.examples?.[activeTestCaseId]?.inputText}
              </div>
              <p className="mt-4 text-sm font-medium text-white">Output:</p>
              <div className="bg-dark-fill-3 mt-2 w-full cursor-text rounded-lg border border-transparent px-3 py-[10px] text-white">
                {desafio?.examples?.[activeTestCaseId]?.outputText}
              </div>
            </div>
          </div>
        </div>
        {showResults && (
          <div className="w-full overflow-auto px-5">
            <div className="text-sm font-medium leading-5 text-white">Results</div>
            <div className="bg-dark-fill-3 mt-2 w-full cursor-text rounded-lg border border-transparent px-3 py-[10px] text-white">
              {results.map((result, index) => (
                <div key={index} className="my-2">
                  <strong>Case {index + 1}:</strong> {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </Split>
      <EditorFooter
        onRun={handleRun}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
