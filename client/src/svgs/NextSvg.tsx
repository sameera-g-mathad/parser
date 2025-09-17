import type { className } from "@/interface";
import React from "react";

export const NextSvg: React.FC<className> = ({ className }) => {
    return <svg className={`${className} w-4 h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g strokeWidth="0">
        </g>
        <g strokeLinecap="round" strokeLinejoin="round">
        </g>
        <g>
            <g id="next">
                <g>
                    <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 ">
                    </polygon>
                </g>
            </g>
        </g>
    </svg>
};
