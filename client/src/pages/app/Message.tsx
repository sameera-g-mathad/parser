import React from "react";
import { useAuth } from "@/context/authContext";
import { LogoSvg } from "@/svgs";
import type { messageInterface } from "@/interface";


/**
 * 
 * @param message - Contains (by and content) to display messages accordingly.
 * @returns - A JSX Component that displays messages on the screen.
 */
export const Message: React.FC<messageInterface> = ({ message }) => {
    // desturcture message.
    const { by, content } = message
    // Get user.
    const { user } = useAuth()
    const displayUserInfo = user.firstName[0] + user.lastName[0]
    // return ai or human message.
    return <div className="p-2">{
        by === 'ai' ?
            <div className="flex gap-2">
                <LogoSvg className="w-10 h-7" />
                <span>{content}</span>
            </div> :
            <div className="flex gap-2 items-center">
                <div className="w-10 h-9 text-xs  font-semibold flex justify-center items-center">
                    <span className="w-8 h-8 border  rounded-full uppercase flex justify-center items-center">{displayUserInfo}</span>
                </div>
                <span>{content}</span>
            </div>
    }</div>
};
