"use client";
import ConfigBar from "@/components/ConfigBar";
import ConfigButton from "@/components/configButton";
import WordDisplay from "@/components/WordDisplay";
import { thaana_keyMap } from "@/lib/thaana-utils";
import { cn, generateText } from "@/lib/utils";
import { ChevronDown, RefreshCcw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StatsBar from "@/components/StatsBar";

type statusEnum = "pending" | "correct" | "incorrect";

interface charObj {
   char: string;
   status: statusEnum;
}

export interface wordObj {
   chars: charObj[];
   status: statusEnum;
}

export interface Config {
   mode: "words" | "duration";
   units: number;
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

   const [GameState, setGameState] = useState<"FINISHED" | "PlAYING" | "IDLE">(
      "IDLE",
   );

   const [timeleft, setTimeleft] = useState(60);
   const [timeElapsed, settimeElapsed] = useState(0);
   const [CorrectChars, setCorrectChars] = useState(0);

   const [config, setConfig] = useState<Config>({
      mode: "words",
      units: 30,
   });

   const startNewGame = () => {
      setWordList(genGameData(generateText(30)));
      setWordIdx(0);
      setCharIdx(0);
      setCurrentValue("");

      //
      setTimeleft(config.mode == "duration" ? config.units : 0);
      settimeElapsed(0);
      setGameState("IDLE");
      setCorrectChars(0);
   };

   useEffect(() => {
      startNewGame();
   }, [config]);

   useEffect(() => {
      if (GameState != "PlAYING") return;

      let interval = setInterval(() => {
         settimeElapsed((prev) => prev + 1);

         if (config.mode == "duration") {
            setTimeleft((prev) => {
               if (prev <= 1) {
                  setGameState("FINISHED");
                  return 0;
               }
               return prev - 1;
            });
         }
      }, 1000);

      return () => clearInterval(interval);
   }, [GameState, timeleft]);

   const editLetter = (Backspace: boolean, isTargerChar?: boolean) => {
      let count = 0;

      const activeWord = wordList[wordIdx];
      const currentCharIDX = Backspace ? charIdx - 1 : charIdx;
      const currentChar = activeWord.chars[currentCharIDX];

      if (isTargerChar && !Backspace) {
         count = 1;
      } else if (Backspace && currentChar.status === "correct") {
         count = -1;
      }

      setWordList((prev) => {
         const newWordList = [...prev];
         const newActiveWord = { ...newWordList[wordIdx] };
         const targetChar = { ...newActiveWord.chars[currentCharIDX] };

         targetChar.status = Backspace
            ? "pending"
            : isTargerChar
              ? "correct"
              : "incorrect";

         newActiveWord.chars[currentCharIDX] = targetChar;
         newWordList[wordIdx] = newActiveWord;
         return newWordList;
      });

      if (count !== 0) {
         setCorrectChars((prev) => prev + count);
         console.log("Incremented by:", count);
      }
   };

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

            editLetter(true);
         }
         return;
      }

      //TODO: Space logic
      if (e.key === " ") {
         const allChCorrect = activeWord.chars.every(
            (ch) => ch.status === "correct",
         );

         if (allChCorrect && charIdx === activeWord.chars.length) {
            if (wordIdx != wordList.length - 1) {
               setWordIdx((prev) => prev + 1);
               setCharIdx(0);
               setCurrentValue("");
               return;
            }
            setCurrentValue("");
            setGameState("FINISHED");
         }
      }

      const thaanaChar = thaana_keyMap[e.key];
      if (!thaanaChar) return;

      if (charIdx >= activeWord.chars.length) return;
      const isCorrect = thaanaChar === targetChar;

      editLetter(false, isCorrect);

      if (GameState == "IDLE") setGameState("PlAYING");
      setCharIdx((prev) => prev + 1);
      setCurrentValue((prev) => prev + thaanaChar);
   };

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
            {GameState != "IDLE" ? (
               <StatsBar
                  correctChars={CorrectChars}
                  timeElapsed={timeElapsed}
               />
            ) : (
               <ConfigBar config={config} setConfig={setConfig} />
            )}

            <WordDisplay wordIdx={wordIdx} wordList={wordList} />

            <div className="flex w-full gap-4 items-center pt-2">
               <input
                  type="text"
                  autoFocus
                  onKeyDown={handleOnKeydown}
                  value={currentValue}
                  disabled={GameState == "FINISHED"}
                  placeholder={"މިތާ ލިޔޭ..."}
                  className="w-full border border-zinc-800 px-6 py-4 text-4xl rounded-xl  
                       focus:outline-none bg-transparent"
               />
               <button
                  onClick={startNewGame}
                  className={cn(
                     "p-6 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors",
                     {
                        "animate-bounce from-blue-500 via-blue-600 to-blue-700 bg-gradient-to-br":
                           GameState == "FINISHED",
                     },
                  )}
                  // className="p-5 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
               >
                  <RefreshCcw className="h-7 w-7" />
               </button>
            </div>
         </main>

         <footer className="fixed bottom-10 w-full text-center text-md text-gray-200/80">
            <div className="text-4xl animate-bounce ">
               {GameState == "FINISHED" ? "ނިމުނީ" : ""}
            </div>
         </footer>
      </div>
   );
}
