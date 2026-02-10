import React, { type PropsWithChildren } from "react";
import { type highlightInterface } from "./interface";

/**
 * 
 * @param className Tailwind classes in the string format.
 * @param children Content to be highlighted.
 * @returns 
 */
export const Highlight: React.FC<highlightInterface & PropsWithChildren> = ({ color, children }) => {

    const getColorValues = (color: string) => {
        switch (color) {
            case 'indigo': return 'bg-indigo-200 text-indigo-600 border-indigo-600';
            case 'pink': return 'bg-pink-200 text-pink-600 border-pink-600';
            case 'orange': return 'bg-orange-200 text-orange-600 border-orange-600';
            case 'red': return 'bg-red-200 text-red-600 border-red-600';
            case 'blue': return 'bg-blue-200 text-blue-600 border-blue-600';
            case 'green': return 'bg-green-200 text-green-600 border-green-600';
            case 'fuchsia': return 'bg-fuchsia-200 text-fuchsia-600 border-fuchsia-600';
            case 'yellow': return 'bg-amber-200 text-amber-600 border-amber-600';
            default: return 'bg-gray-200 text-gray-600 border-gray-600'
        }
    }

    return <>
        <span className={`${getColorValues(color)} rounded border-b-2 mx-0.5 px-0.5 `}>
            {children}
        </span>
    </>
};
