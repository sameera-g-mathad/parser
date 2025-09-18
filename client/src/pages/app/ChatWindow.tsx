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
    const [messages, setMessages] = useState<message[]>([]);
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
        setMessages(prevMsgs =>
            [
                ...prevMsgs,
                { by: 'human', content: query },
                { by: 'ai', content: 'RAG stands for "Retrieval-Augmented Generation" in the field of Artificial Intelligence. It is a framework that combines retrieval-based methods with generative models to enhance AI systems by tracing each output back to its source document. RAG allows for human feedback, continual improvements, and minimizing inaccuracies, hallucinations, and bias in AI systems.' }
            ]
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

            // get the message back from the buffer.
            message += decoder.decode(value);

            setMessages(prevMsgs => {
                const newMsgs = [...prevMsgs];
                // overwrite the last message.
                newMsgs[prevMsgs.length - 1] = { by: 'ai', 'content': message }
                return newMsgs;
            });
        }


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