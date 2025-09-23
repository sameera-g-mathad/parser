import React, { useEffect, useRef, useState } from "react";
import { TextBox } from "@/reusables";
import { useErrorHandler } from "@/hooks";
import type { className, chat, chatWindowInterface } from "@/interface";
import { useLocation } from "react-router-dom";
import { Message } from "./";


/**
 * 
 * @param className Tailwind classes in the string format.
 * @returns A JSX element that displays the chat window with both the text box and
 * the messages.
 */
export const ChatWindow: React.FC<className & chatWindowInterface> = ({ className, history, onPageClick }) => {
    const [messages, setMessages] = useState<chat[]>([]);
    const [streaming, setStreaming] = useState<boolean>(false);
    const { withErrorHandler } = useErrorHandler()
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

    useEffect(() => {
        setMessages([...history])
    }, [history])

    // method called when the query is submitted to the 
    // server.
    const onSubmit = withErrorHandler(async (query: string) => {
        setStreaming(true)
        setMessages(prevMsgs =>
            [
                ...prevMsgs,
                { type: 'human', message: query },
                { type: 'ai', message: "", runningQuestion: '' }]
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
            const lines = buffer.split('\n') // important: there can be more than one object and parsing fails if not for this.
            lines.pop() // this removes unwanted '' from the list

            for (let line of lines) {
                // object sent from server is either {event: token, token} or {event: pageNumber, pageNumbers} for now.
                const lineObj: { event: 'token' | 'pageNumber' | 'runningQuestion', token?: string, pageNumbers?: number[], runningQuestion?: string } = JSON.parse(line);
                if (lineObj.event === 'token') {
                    message += lineObj.token;

                    setMessages(prevMsgs => {
                        const newMsg = [...prevMsgs]
                        const lastIndex = prevMsgs.length - 1;
                        // overwrite the last message.
                        if (prevMsgs[lastIndex].type === 'ai')
                            newMsg[lastIndex] = { ...prevMsgs[lastIndex], message: message }
                        return newMsg;
                    });
                }
                else if (lineObj.event === 'pageNumber') {
                    setMessages(prevMsgs => {
                        const lastIndex = prevMsgs.length - 1
                        // overwrite the last message.
                        if (prevMsgs[lastIndex].type === 'ai')
                            prevMsgs[lastIndex] = { ...prevMsgs[lastIndex], pageNumbers: lineObj.pageNumbers }
                        return prevMsgs;
                    });
                }
                else {
                    setMessages(prevMsgs => {
                        const lastIndex = prevMsgs.length - 1
                        // overwrite the last message.
                        if (prevMsgs[lastIndex].type === 'ai')
                            prevMsgs[lastIndex] = { ...prevMsgs[lastIndex], runningQuestion: lineObj.runningQuestion || '' }
                        return prevMsgs;
                    });
                }
            }

        }
        setStreaming(false)
    })

    return <div className={`grid grid-rows-16 h-full ${className}`}>
        <div className="row-start-1 row-span-14 overflow-y-scroll scrollbar-hide" ref={chatWindowRef}>
            {
                messages.map(
                    (el, index) => <Message key={index} chat={el} streaming={index === messages.length - 1 ? streaming : false} onPageClick={onPageClick} />
                )
            }
        </div>
        <div className="row-start-15 row-span-full flex flex-col justify-center items-center">
            <TextBox placeholder="How can i help today?"
                onSubmit={onSubmit}
            />
            <span className="capitalize pt-2">powered by ChatGPT</span>
        </div>

    </div>;
};


ChatWindow.displayName = 'ChatWindow'