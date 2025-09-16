import React, { useState } from "react";
import type { textBoxInterface } from "./interface";
import { Button } from "./Button";
import { SendSVG } from "@/svgs/SendSVG";


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

    return <div className="auth-input border flex items-center rounded-2xl! p-1">
        <textarea
            className={` resize-none flex items-center flex-1! outline-none placeholder:font-semibold placeholder-slate-500 p-0.5`}
            placeholder={placeholder}
            style={{ height: scrollHeight }}
            value={query}
            onChange={(e) => {
                // If the value if not a enter of empty on back space, then set the query.
                if (e.target.value && e.target.value !== '' && e.target.value !== '\n') {
                    setQuery(e.target.value)
                    // adjust the textbox based on the text entered.
                    setScrollHeight(e.target.scrollHeight < 80 ? e.target.scrollHeight : 80)
                }
                else {
                    // set the textbox back to empty and default height.
                    setQuery("")
                    setScrollHeight(30)
                }
            }
            }
            onKeyDown={(e) => {
                // When the enter button is clicked.
                if (e.key.toLowerCase() === 'enter') {
                    onSubmit(query);
                    setQuery('');
                }
            }
            }
        />
        <Button className="active:scale-75 transform transition-transform duration-100" callback={() => onSubmit(query)}>
            <SendSVG className="stroke-slate-700 w-7! h-7!" />
        </Button>
    </div>;
};

TextBox.displayName = 'TextBox'