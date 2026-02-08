import React from "react";

interface Props {
   timeElapsed: number;
   correctChars: number;
}
export default function StatsBar({ timeElapsed, correctChars }: Props) {
   const minsPassed = timeElapsed / 60;
   const currentWPM =
      minsPassed > 0 ? Math.round(correctChars / 5 / minsPassed) : 0;

   return (
      <div className="flex justify-between w-full text-xl mb-5 font-bold text-2xl">
         <div>WPM: {currentWPM}</div>
         <div>{timeElapsed}</div>
      </div>
   );
}
