import { cn } from "@/lib/utils";
import React from "react";

interface Props<T extends string | number> {
   value: T;
   label?: React.ReactNode;
   selectedValue: T;
   onChange: (v: T) => void;
}

export default function ConfigButton<T extends string | number>({
   value,
   label,
   onChange,
   selectedValue,
}: Props<T>) {
   return (
      <button
         className={cn(
            "opacity-60 hover:opacity-100 cursor-pointer transition",
            selectedValue === value && "underline opacity-100 ",
         )}
         onClick={() => onChange(value)}
      >
         {label ?? String(value)}
      </button>
   );
}
