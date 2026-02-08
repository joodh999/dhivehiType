import { wordObj } from "@/app/page";
import { cn } from "@/lib/utils";

interface Props {
   wordList: wordObj[];
   wordIdx: number;
}

export default function WordDisplay({ wordList, wordIdx }: Props) {
   return (
      <div className="text-4xl leading-loose wrap-break-word whitespace-normal">
         {wordList.map((w, wIndex) => (
            <span
               key={wIndex}
               className={cn({
                  "underline underline-offset-9 decoration-white/80":
                     wIndex === wordIdx,
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
                     })}
                  >
                     {ch.char}
                  </span>
               ))}
            </span>
         ))}
      </div>
   );
}
