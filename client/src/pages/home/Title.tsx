import React from "react";
import { type titleInterface } from '@/interface'

/**
 * @param title - The title to display in the tech stack card.
 * @param subTitle - The subtitle to display in the tech stack card. 
 * @returns  React.JSX
 */
export const Title: React.FC<titleInterface> = ({ subTitle, title }) => {
    return <div className="flex flex-col items-center gap-4 mb-20">
        <span className="text-4xl tracking-tight font-light">{title}</span>
        <span>{subTitle}</span>
    </div>;
};

Title.displayName = 'Title'