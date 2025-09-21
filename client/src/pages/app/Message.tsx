import React, { memo } from "react";
import { useAuth } from "@/context/authContext";
import { LogoSvg, PageNumberSvg } from "@/svgs";
import type { messageInterface } from "@/interface";


/**
 * 
 * @param message - Contains (by and content) to display messages accordingly.
 * @returns - A JSX Component that displays messages on the screen.
 */
export const Message: React.FC<messageInterface> = memo(({ chat, streaming, onPageClick }) => {
    // desturcture message.
    const { type, message } = chat
    // Get user.
    const { user } = useAuth()
    const displayUserInfo = user.firstName[0] + user.lastName[0]
    // return ai or human message.
    return <div className="p-2 leading-7 text-sm my-2">{
        type === 'ai'
            ? // Message from AI.
            <div className="flex flex-col gap-2">
                <div className="flex items-center order-2 gap-2">
                    <LogoSvg className={`w-10 h-7 ${streaming ? 'streaming-logo' : ''}`} />
                    {/** Display page numbers. */}
                    {
                        chat.pageNumbers ? chat.pageNumbers.map((el, i) =>
                            <div key={i}
                                className="flex border justify-between items-center rounded-lg gap-2 p-1 px-2 cursor-pointer"
                                onClick={() => onPageClick(el)}
                            >
                                <PageNumberSvg className="w-4 h-4" />
                                <span>{el}</span>
                            </div>) : ''
                    }
                </div>
                <div className="flex order-1">{message}</div>
            </div>
            : // Message from user.
            <div className="flex gap-2 py-2 border rounded-xl">
                <div className="w-10 h-8 text-xs font-semibold flex justify-center items-start">
                    <div className="w-8 h-8 border  rounded-full uppercase flex justify-center items-center">{displayUserInfo}</div>
                </div>
                <div className="whitespace-pre-wrap flex flex-wrap overflow-scroll">{message}</div>
            </div>
    }</div>
});
