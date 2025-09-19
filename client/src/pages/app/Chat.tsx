import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatWindow, PDFWindow } from "./";
import { useCustomReducer } from "@/hooks";

/**
 * 
 * @returns A JSX Component, that displays both pdf and
 * a chat window for the user to ask questions.
 */
export const Chat: React.FC = () => {
    const { state, setFieldWithValue } = useCustomReducer({ pdfUrl: '', moveToPage: 1 })
    const location = useLocation()

    /**
     * Get the pdf url from s3 bucket with a
     * request to backend.
     */
    const getPdfUrl = async () => {
        const response = await fetch(`/api${location.pathname}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        setFieldWithValue('pdfUrl', data.url)
    }
    useEffect(() => { getPdfUrl() }, []);
    const { pdfUrl, moveToPage } = state;

    return <div className="w-full h-screen flex justify-between">
        <div className="w-full flex justify-center "><ChatWindow className="w-[90%]" onPageClick={(page: number) => setFieldWithValue('moveToPage', page)} /></div>
        <div className="sm:w-full">
            {pdfUrl ? <PDFWindow url={pdfUrl} moveToPage={moveToPage} /> : ''}
        </div>
    </div>;
};
