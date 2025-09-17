import React, { useEffect, useRef, useState } from "react";
import { TextBox } from "@/reusables";
import { Message } from "./";
import type { className, message } from "@/interface";
import { useLocation } from "react-router-dom";


/**
 * 
 * @param className Tailwind classes in the string format.
 * @returns A JSX element that displays the chat window with both the text box and
 * the messages.
 */
export const ChatWindow: React.FC<className> = ({ className }) => {
    const [messages, setMessages] = useState<message[]>([])
    const chatWindowRef = useRef<HTMLDivElement>(null)
    const location = useLocation()

    // This sets the scroller to the current message being displayed
    // on the screen.
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
        }
    }, [messages])

    // method called when the query is submitted to the 
    // server.
    const onSubmit = async (query: string) => {
        setMessages(prevMsgs =>
            [
                ...prevMsgs,
                { by: 'human', content: query },
                { by: 'ai', content: 'what is ai' }
            ]
        )
        const response = await fetch(`/api${location.pathname}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        })
        // will implement streaming next.
        console.log(response)
    }

    return <div className={`grid grid-rows-16 h-full ${className}`}>
        <div className="row-start-1 row-span-14 overflow-y-scroll scrollbar-hide" ref={chatWindowRef}>
            {
                messages.map(
                    (el, index) => <Message key={index} message={el} />
                )
            }
        </div>
        <div className="row-start-15 row-span-full flex justify-center items-center">
            <TextBox placeholder="How can i help today?"
                onSubmit={onSubmit}
            />
        </div>
    </div>;
};


ChatWindow.displayName = 'ChatWindow'