import type { className } from "@/interface";
import React from "react";

export const RefreshSvg: React.FC<className> = ({ className }) => {
    return <svg className={`${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g strokeWidth="0">
        </g>
        <g strokeLinecap="round" strokeLinejoin="round">
        </g>
        <g>
            <path d="M3 3V8M3 8H8M3 8L6 5.29168C7.59227 3.86656 9.69494 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.71683 21 4.13247 18.008 3.22302 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            </path>
        </g>
    </svg>
};
