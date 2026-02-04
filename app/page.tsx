"use client";
import { thaana_keyMap } from "@/lib/thaana-utils";
import { cn, generateText } from "@/lib/utils";
import { ChevronDown, RefreshCcw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type statusEnum = "pending" | "correct" | "incorrect" | "corrected" | "active";

interface charObj {
   char: string;
   status: statusEnum;
}

interface wordObj {
   chars: charObj[];
   status: statusEnum;
}

function genGameData(wordList: string[]): wordObj[] {
   return wordList.map((word) => ({
      chars: word.split("").map((ch) => ({ char: ch, status: "pending" })),
      status: "pending",
   }));
}

export default function Home() {
   const [wordList, setWordList] = useState<wordObj[]>([]);
   const [wordIdx, setWordIdx] = useState(0);
   const [charIdx, setCharIdx] = useState(0);
   const [currentValue, setCurrentValue] = useState("");

   const startNewGame = useCallback(() => {
      setWordList(genGameData(generateText(30)));
      setWordIdx(0);
      setCharIdx(0);
      setCurrentValue("");
   }, []);

   useEffect(() => {
      startNewGame();
   }, [startNewGame]);

   const handleOnKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "Tab") return;
      e.preventDefault();

      if (!wordList[wordIdx]) return;

      const activeWord = wordList[wordIdx];
      const targetChar = activeWord.chars[charIdx]?.char;

      if (e.key === "Backspace") {
         if (charIdx > 0) {
            const newCharIdx = charIdx - 1;
            setCharIdx(newCharIdx);
            setCurrentValue((prev) => prev.slice(0, -1));

            setWordList((prev) =>
               prev.map((word, wIdx) => {
                  if (wIdx !== wordIdx) return word;

                  return {
                     ...word,
                     chars: word.chars.map((ch, cIdx) => {
                        if (cIdx !== newCharIdx) return ch;
                        return {
                           ...ch,
                           status: "pending",
                        };
                     }),
                  };
               }),
            );
         }
         return;
      }

      //TODO: Space logic
      if (e.key === " ") {
         const allChCorrect = activeWord.chars.every(
            (ch) => ch.status === "correct",
         );

         if (allChCorrect && charIdx === activeWord.chars.length) {
            setWordList((prev) =>
               prev.map((word, wIdx) => {
                  if (wIdx !== wordIdx) return word;
                  return {
                     ...word,
                     status: "correct",
                  };
               }),
            );
            setWordIdx((prev) => prev + 1);
            setCharIdx(0);
            setCurrentValue("");
         }

         return;
      }

      const thaanaChar = thaana_keyMap[e.key];
      if (!thaanaChar) return;

      if (charIdx >= activeWord.chars.length) return;
      const isCorrect = thaanaChar === targetChar;

      setWordList((prev) =>
         prev.map((word, wIdx) => {
            if (wIdx !== wordIdx) return word;

            return {
               ...word,
               status: "active",
               chars: word.chars.map((ch, cIdx) => {
                  if (cIdx !== charIdx) return ch;

                  const newStatus =
                     ch.status === "incorrect" && isCorrect
                        ? "corrected"
                        : isCorrect
                          ? "correct"
                          : "incorrect";

                  return {
                     ...ch,
                     status: newStatus,
                  };
               }),
            };
         }),
      );

      setCharIdx((prev) => prev + 1);
      setCurrentValue((prev) => prev + thaanaChar);
   };

   useEffect(() => {
      console.log("Current word:", wordList[wordIdx]);
      console.log("Char index:", charIdx);
      console.log("Current value:", currentValue);
   }, [wordList, wordIdx, charIdx, currentValue]);

   return (
      <div className="min-h-screen">
         <header className="p-10 flex justify-between max-w-[90vw] mx-auto w-full">
            <h1 className="text-4xl font-bold">ދިވެހިޓައިޕް</h1>
            <button className="flex items-center gap-2 text-xl hover:cursor-pointer transition-colors">
               <span>އިތުރު</span>
               <ChevronDown className="h-4 w-4" />
            </button>
         </header>

         <main className="flex flex-col h-[calc(100vh-200px)] max-w-[80vw] mx-auto px-4 justify-center items-center">
            <div className="flex py-5 max-w-[80vw] mx-auto px-4 ">
               {/* <span className="text-xl">30 WPM</span> */}
            </div>
            <div className="text-4xl leading-loose wrap-break-word whitespace-normal">
               {wordList.map((w, wIndex) => (
                  <span
                     key={wIndex}
                     className={cn({
                        "underline underline-offset-8":
                           wIndex === wordIdx || w.status === "active",
                     })}
                  >
                     <span className="opacity-0"> </span>
                     {w.chars.map((ch, chIndex) => (
                        <span
                           key={chIndex}
                           className={cn({
                              "text-gray-500": ch.status === "pending",
                              "text-red-500": ch.status === "incorrect",
                              "text-gray-100": ch.status === "correct",
                              "text-orange-400": ch.status === "corrected",
                           })}
                        >
                           {ch.char}
                        </span>
                     ))}
                  </span>
               ))}
            </div>

            <div className="flex w-full gap-4 items-center pt-2">
               <input
                  type="text"
                  autoFocus
                  onKeyDown={handleOnKeydown}
                  value={currentValue}
                  placeholder={"މިތާ ލިޔޭ"}
                  className="w-full border border-zinc-800 px-6 py-4 text-2xl rounded-xl 
                       focus:outline-none bg-transparent"
               />
               <button
                  onClick={startNewGame}
                  className="p-5 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
               >
                  <RefreshCcw className="h-7 w-7" />
               </button>
            </div>
         </main>

         <footer className="fixed bottom-10 w-full text-center text-md text-gray-200/80">
            <p>footer</p>
         </footer>
      </div>
   );
}
