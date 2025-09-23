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
    const displayUserInfo = user.firstName[0] + user.lastName[0];

    const colors: string[] = [
        "bg-pink-100 fill-pink-500 border-pink-500 text-pink-500",
        "bg-orange-100 fill-orange-500 border-orange-500 text-orange-500",
        "bg-teal-100 fill-teal-500 border-teal-500 text-teal-500",
        "bg-indigo-100 fill-indigo-500 border-indigo-500 text-indigo-500",
        "bg-fuchsia-100 fill-fuchsia-500 border-fuchsia-500 text-fuchsia-500"
    ];
    // return ai or human message.
    return <div className="p-2 leading-7 text-sm my-2">{
        type === 'ai'
            ? // Message from AI.
            <div className="flex flex-col gap-2">
                {
                    // Only display if there is a running question.
                    chat.runningQuestion
                        ?
                        <span className="border bg-indigo-200 text-indigo-500 border-indigo-500 rounded-xl p-2 flex flex-col appearing-in ">
                            <span className="text-[10px]">Running Context:</span>
                            <span>{chat.runningQuestion}</span>
                        </span>
                        :
                        ''
                }
                <div className="flex items-center order-2 gap-2">
                    <LogoSvg className={`w-10 h-8 ${streaming ? 'streaming-logo' : ''}`} />
                    {/** Display page numbers. */}
                    {
                        chat.pageNumbers ? chat.pageNumbers.map((el, i) =>
                            <div key={i}
                                className={`flex border justify-between items-center rounded-lg gap-2 p-1 px-2 cursor-pointer btn-click appearing-in ${colors[i]}`}
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
            <div className="flex gap-2 py-3 px-1 border rounded-xl border-slate-200 shadow-2xs bg-white">
                <div className="w-10 h-8 text-xs font-semibold flex justify-center items-start">
                    <div className="w-8 h-8 bg-green-200 text-green-700 rounded-full uppercase flex justify-center items-center">{displayUserInfo}</div>
                </div>
                <div className="whitespace-pre-wrap flex flex-wrap overflow-scroll">{message}</div>
            </div>
    }</div>
});
