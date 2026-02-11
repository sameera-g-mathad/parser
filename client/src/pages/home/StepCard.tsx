import type { stepCardInterface } from "@/interface";
import React from "react";

/**
 * 
 * @param content - The content to display in the step card.
 * @param eyebrow - The eyebrow to display in the step card.
 * @param icon - The icon to display in the step card.
 * @param title - The title to display in the step card. 
 * @returns React.JSX
 */
export const StepCard: React.FC<stepCardInterface> = ({ content, eyebrow, icon, title }) => {
    return <div className="bg-white flex justify-between gap-3 rounded-2xl transition-shadow duration-200 hover:shadow-lg w-[35%] h-48 p-5 pt-8">
        <div className="flex items-start">
            {icon}
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest">{eyebrow}</span>
                <span className="text-lg font-semibold">{title}</span>
            </div>
            <span className="text-sm font-light">{content}</span>
        </div>
    </div>;
};

StepCard.displayName = 'StepCard'