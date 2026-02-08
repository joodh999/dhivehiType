import React from "react";
import ConfigButton from "./configButton";
import { Config } from "@/app/page";

interface Props {
   config: Config;
   setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function ConfigBar({ config, setConfig }: Props) {
   return (
      <div className="flex justify-between w-full text-xl mb-5">
         <div className="flex gap-2">
            <ConfigButton
               value={30}
               selectedValue={config.units}
               onChange={(value) =>
                  setConfig((prev) => ({
                     ...prev,
                     units: value,
                  }))
               }
            />
            /
            <ConfigButton
               value={60}
               selectedValue={config.units}
               onChange={(value) =>
                  setConfig((prev) => ({
                     ...prev,
                     units: value,
                  }))
               }
            />{" "}
            /
            <ConfigButton
               value={120}
               selectedValue={config.units}
               onChange={(value) =>
                  setConfig((prev) => ({
                     ...prev,
                     units: value,
                  }))
               }
            />
         </div>
         <div className="flex gap-2">
            <ConfigButton
               value={"duration"}
               label={"ސިކުންތު"}
               selectedValue={config.mode}
               onChange={(value) =>
                  setConfig((prev) => ({ ...prev, mode: value }))
               }
            />{" "}
            /
            <ConfigButton
               value={"words"}
               label={"ބަސް"}
               selectedValue={config.mode}
               onChange={(value) =>
                  setConfig((prev) => ({ ...prev, mode: value }))
               }
            />
         </div>
      </div>
   );
}
