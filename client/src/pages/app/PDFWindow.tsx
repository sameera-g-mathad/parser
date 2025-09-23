import React, { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument, type PDFDocumentLoadingTask, type PDFDocumentProxy, type PDFPageProxy } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import type { pdfWindowInterface } from "@/interface";
import { Button } from "@/reusables";
import { NextSvg, PdfSvg } from "@/svgs";

// needed as a worker for pdfjs to run process in the
// background.
GlobalWorkerOptions.workerSrc = pdfWorker

/**
 * 
 * @param url url to fetch the pdf from
 * @param moveToPage Page number and content to be displayed when the 
 * component renders.
 * @returns A JSX Component to view the pdf on the screen.
 */
export const PDFWindow: React.FC<pdfWindowInterface> = ({ url, moveToPage, pdfName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Pdf document.
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    // Current Page being rendered.
    const [currentPage, setCurrentPage] = useState<number>(moveToPage);
    // Total number of pages the pdf has.
    const [totalPages, setTotalPages] = useState<number>(0);

    const [pageAnimation, setPageAnimation] = useState<'pdf-load-page' | 'pdf-next-page' | 'pdf-prev-page'>('pdf-load-page')

    /**
     * Method to load the pdf using pdfjs-dist.getDocument()
     * @param url url to load the pdf.
     * @returns Promise<void>
     */
    const loadPdf = async (url: string) => {
        if (!url) return;

        // get the whole document.
        const pdfPromise: PDFDocumentLoadingTask = getDocument(
            {
                url,
                disableStream: false, // for faster loading maybe?
                disableAutoFetch: false
            }
        );
        const pdfDoc: PDFDocumentProxy = await pdfPromise.promise

        setPdfDoc(pdfDoc);
        setTotalPages(pdfDoc.numPages)
    }

    /**
     * This method is used to render the current page of the 
     * document onto the screen using canvas api.
     * @returns Promise<void>
     */
    const renderPage = async () => {
        if (!pdfDoc) return;
        // get the current page.
        const page: PDFPageProxy = await pdfDoc.getPage(currentPage);
        // scale: sets how sharp the page should look.
        const viewport = page.getViewport({ scale: 2 })

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // render the page.
        await page.render({ canvasContext: ctx, viewport, canvas }).promise
    }

    /**
     * Method to increament the page number
     */
    const incrementPage = () => {
        // requested page should be within the range.
        if (currentPage + 1 <= totalPages) {
            setPageAnimation('pdf-next-page')
            setCurrentPage(currentPage + 1)
        }
    }

    /**
    * Method to decrement the page number
    */
    const decrementPage = () => {
        // requested page should be within the range.
        if (currentPage - 1 >= 1) {
            setPageAnimation('pdf-prev-page')
            setCurrentPage(currentPage - 1)
        }
    }

    // load pdf on url change..
    useEffect(() => {
        loadPdf(url)
    }, [url])

    // update moveTo page on change.
    useEffect(() => {
        setCurrentPage(moveToPage)
        setPageAnimation('pdf-load-page')
    }, [moveToPage])

    // render page if pdfdoc or current page changes.
    useEffect(() => {
        if (!pdfDoc) return;
        renderPage()
    }, [pdfDoc, currentPage])

    return <div className="w-full h-full flex flex-col border border-slate-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 shadow-md">
            <div className="flex items-center gap-3">
                <PdfSvg className="w-12 h-12 p-2 border rounded-xl bg-blue-100 fill-blue-500 border-blue-500" />
                <span className="flex flex-col gap-0.5">
                    <span className="text-xl">Document Viewer</span>
                    <span>{pdfName}</span>
                </span>
            </div>
            <div className="flex justify-between items-center rounded-lg border bg-teal-100 fill-teal-500 border-teal-500 ">
                <Button callback={decrementPage}><NextSvg className="rotate-180 btn-click w-7 h-7 p-1.5" /></Button>
                <span className="text-sm flex gap-2">
                    <span className="first-letter:capitalize">page {currentPage} of {totalPages} </span>
                </span>
                <Button callback={incrementPage}><NextSvg className="btn-click  w-7 h-7 p-1.5" /></Button>
            </div>
        </div>
        {
            pdfDoc ?
                <canvas key={currentPage} ref={canvasRef} id='pdf-viewer' className={`w-full h-[50%] p-4 flex-1 ${pageAnimation}`} /> :
                <div className="w-full h-full flex justify-center items-center bg-white m-4">
                    <span className="font-semibold text-lg text-slate-500 animate-pulse">{pdfName}.</span>
                </div>
        }


    </div>
};


PDFWindow.displayName = 'PDFWindow'