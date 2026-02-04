import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import words from "./thaana-words.json";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function generateText(wordCount: number): string[] {
   let result: string[] = [];
   for (let i = 0; i < wordCount; i++) {
      const WordIndex = Math.floor(Math.random() * words.length);
      result.push(words[WordIndex]);
   }
   return result;
}
