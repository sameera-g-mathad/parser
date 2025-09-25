import React, { useRef, useState } from "react";
import type { textBoxInterface } from "./interface";
import { Button } from "./Button";
import { SendSvg } from "@/svgs";


/**
 * 
 * @param placeholder - A placeholder needed to display inside the textbox
 * @param onSubmit - A callback method that is called on enter or when submit 
 * button is clicked.
 * @returns - A JSX Component that returns a textbox that can be used to use for
 * quering.
 */
export const TextBox: React.FC<textBoxInterface> = ({ placeholder, onSubmit }) => {
    const [scrollHeight, setScrollHeight] = useState<number>(30);
    const [query, setQuery] = useState<string>("");
    const divRef = useRef<HTMLDivElement>(null);

    /**
     * Method to set query, this takes the text content of 
     * the div tag.
     * @returns void
     */
    const onChange = () => {
        if (!divRef.current) return;
        const message = divRef.current.innerText.trim()
        // If the value if not a enter of empty on back space, then set the query.
        if (message && message !== '' && message !== '\n') {
            setQuery(message)
            // adjust the textbox based on the text entered.
            setScrollHeight(divRef.current.scrollHeight < 80 ? divRef.current.scrollHeight : 80)
        }
        else {
            // set the textbox back to empty and default height.
            setQuery("")
            setScrollHeight(30)
        }
    }

    /**
     * This method submits the query on enter.
     * @param e Keyboard event, in this case a enter event.
     * @returns 
     */
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        if (query.trim() === '') return
        // When the enter button is clicked.
        if (e.key.toLowerCase() === 'enter') {
            onSubmit(query);
            setQuery('');
            divRef.current.innerText = ''
        }
    }

    /**
     * Method that submits the query on button click.
     * @returns void
     */
    const onButtonClick = () => {
        if (!divRef.current) return;
        if (query.trim() === '')
            return;
        onSubmit(query)
        setQuery('');
        divRef.current.innerText = ''
    }

    return <div className="auth-input border flex items-center rounded-2xl! p-1">
        <div
            className={`textbox resize-none flex items-center flex-1! outline-none placeholder:font-semibold placeholder-slate-500 p-0.5`}
            contentEditable={true}
            ref={divRef}
            style={{ height: scrollHeight }}
            onInput={onChange}
            onKeyDown={onKeyDown}
            data-placeholder={placeholder}
        />
        <Button className="btn-click" callback={onButtonClick}>
            <SendSvg className="stroke-slate-700 w-7! h-7!" />
        </Button>
    </div>;
};

TextBox.displayName = 'TextBox'