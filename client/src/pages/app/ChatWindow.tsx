import React, { useEffect, useRef, useState } from "react";
import { TextBox } from "@/reusables";
import { Message } from "./";
import type { className, message, chatWindowInterface } from "@/interface";
import { useLocation } from "react-router-dom";


/**
 * 
 * @param className Tailwind classes in the string format.
 * @returns A JSX element that displays the chat window with both the text box and
 * the messages.
 */
export const ChatWindow: React.FC<className & chatWindowInterface> = ({ className, onPageClick }) => {
    const [messages, setMessages] = useState<message[]>([]);
    const [streaming, setStreaming] = useState<boolean>(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const decoder = new TextDecoder();

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
        setStreaming(true)
        setMessages(prevMsgs =>
            [
                ...prevMsgs,
                { by: 'human', content: query },
                { by: 'ai', content: "" }]
        )
        const response = await fetch(`/api${location.pathname}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        })
        // get the reader from the stream.
        const reader = response.body?.getReader()
        let message = "";
        // until the streaming is not ended, run
        // the while loop.
        while (true) {
            const { value, done } = await reader?.read()!;

            if (done) break;

            const buffer = decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            lines.pop() // this removes unwanted '' from the list

            for (let line of lines) {
                const lineObj: { event: 'token' | 'pageNumber', token?: string, pageNumbers?: number[] } = JSON.parse(line);
                if (lineObj.event === 'token') {
                    message += lineObj.token;

                    setMessages(prevMsgs => {
                        const newMsgs = [...prevMsgs];
                        // overwrite the last message.
                        newMsgs[prevMsgs.length - 1] = { by: 'ai', 'content': message }
                        return newMsgs;
                    });
                }
                else {
                    setMessages(prevMsgs => {
                        const lastIndex = prevMsgs.length - 1
                        // overwrite the last message.
                        if (prevMsgs[lastIndex].by === 'ai')
                            prevMsgs[lastIndex] = { ...prevMsgs[lastIndex], pageNumbers: lineObj.pageNumbers }
                        return prevMsgs;
                    });
                }
            }

        }
        setStreaming(false)
    }

    return <div className={`grid grid-rows-16 h-full ${className}`}>
        <div className="row-start-1 row-span-14 overflow-y-scroll scrollbar-hide" ref={chatWindowRef}>
            {
                messages.map(
                    (el, index) => <Message key={index} message={el} streaming={index === messages.length - 1 ? streaming : false} onPageClick={onPageClick} />
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