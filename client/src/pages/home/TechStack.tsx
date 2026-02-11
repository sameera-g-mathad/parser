import React from "react";
import type { titleInterface } from "@/interface";

// resuse the title interface
/**
 * 
 * @param title - The title to display in the tech stack card.
 * @param subTitle - The subtitle to display in the tech stack card. 
 * @returns  React.JSX
 */
export const TechStack: React.FC<titleInterface> = ({ title, subTitle }) => {
    return <div className="bg-white w-52 h-20 m-3 flex flex-col justify-center items-center gap-1 rounded-xl transition-transform duration-200 hover:-translate-y-2">
        <span className="tracking-tight ">{title}</span>
        <span className="text-xs">{subTitle}</span>
    </div>;
};

TechStack.displayName = 'TechStack'