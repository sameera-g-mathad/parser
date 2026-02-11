import React from "react";
import type { architectureOverviewInterface } from "@/interface";

/**
 * 
 * @param content - The content to display in the architecture overview card.
 * @param title - The title to display in the architecture overview card.
 * @param badge - A boolean that determines if the title should be displayed as a badge or not.
 * @param badgeColor - The color of the badge if the badge is true. It can be one of the following: indigo, pink, orange, red, blue, green, fuchsia, yellow.
 * @returns React.JSX
 */
export const ArchitectureOverview: React.FC<architectureOverviewInterface> = ({ content, title, badge, badgeColor }) => {
    const getColorValues = (color?: string) => {
        if (color === undefined)
            return 'bg-gray-200 text-gray-600'
        switch (color) {
            case 'indigo': return 'bg-indigo-200 text-indigo-600 rounded-xl';
            case 'pink': return 'bg-pink-200 text-pink-600 rounded-xl';
            case 'orange': return 'bg-orange-200 text-orange-600 rounded-xl';
            case 'red': return 'bg-red-200 text-red-600 rounded-xl';
            case 'blue': return 'bg-blue-200 text-blue-600 rounded-xl';
            case 'green': return 'bg-green-200 text-green-600 rounded-xl';
            case 'fuchsia': return 'bg-fuchsia-200 text-fuchsia-600 rounded-xl';
            case 'yellow': return 'bg-amber-200 text-amber-600 rounded-xl';
            default: return 'bg-gray-200 text-gray-600 rounded-xl'
        }
    }

    return <div className={
        `bg-white rounded-lg w-[500px] h-20 p-5 transition-all duration-200 hover:scale-95 cursor-pointer
        ${badge ? 'flex items-center gap-5' : 'flex flex-col justify-start items-start mb-2'}
    `}>
        {
            badge ? <div className={`${getColorValues(badgeColor)} flex justify-center items-center p-1 px-3 tracking-tight`}>
                {title}
            </div> : <div className={`flex flex-col font-semibold mb-1`}>
                {title}
            </div>
        }
        <span className="text-sm font-light">{content}</span>
    </div>;
};

ArchitectureOverview.displayName = 'ArchitectureOverview'