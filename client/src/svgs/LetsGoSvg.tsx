import type { className } from "@/interface";
import React from "react";

export const LetsGoSvg: React.FC<className> = ({ className }) => {
    return <svg className={`${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <g strokeWidth="0">
        </g>
        <g strokeLinecap="round" strokeLinejoin="round">
        </g>
        <g>
            <path d="M20.414,26.414l9-9c0.781-0.781,0.781-2.047,0-2.828l-9-9c-0.781-0.781-2.047-0.781-2.828,0 s-0.781,2.047,0,2.828L23.172,14H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h19.172l-5.586,5.586c-0.781,0.781-0.781,2.047,0,2.828 S19.633,27.195,20.414,26.414z">
            </path>
        </g>
    </svg>
};
