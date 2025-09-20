import React from "react";
import type { uploadRowInterface } from "@/interface";
import { Button } from "@/reusables";
import { PdfSvg, DeleteSvg } from "@/svgs";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param original_name Name of the file to display 
 * @returns A JSX Component with the details of each uplaod. As of
 * now only name is displayed.
 */
export const ListRow: React.FC<uploadRowInterface> = ({ id, original_name, updated_at, status, rowNum }) => {
    const navigate = useNavigate();
    const deleteById = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const response = await fetch(`/api/app/uploads/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }

    const goTo = () => {
        if (status === 'active') {
            navigate(`/app/uploads/${id}`)
        }
    }


    return <div
        className="pdf-list opacity-0 flex justify-between items-center border-2 border-slate-300 bg-white rounded-xl my-2 p-2 px-5 group overflow-hidden cursor-pointer"
        style={{ animationDelay: `${rowNum! * 0.1}s` }}
        onClick={goTo}
    >
        <div className="flex flex-col flex-5">
            <span className="w-64 capitalize font-semibold ellipses">{original_name}</span>
            <span className="flex items-center gap-1 text-xs mt-2">
                <span>
                    <span className={`p-0.5 px-2 capitalize border font-semibold rounded-lg ${status === 'active' ? 'text-green-600 border-green-600 bg-green-100' : 'text-slate-700 border-slate-600 bg-slate-100'}`}>{status}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                <span>{new Date(updated_at).toDateString()}</span>
            </span>
        </div>
        <div className="flex justify-between items-center flex-1">
            <span className="w-16 h-16 transform transition-transform translate-y-6 rotate-[15deg] group-hover:rotate-0 group-hover:translate-y-0 ">
                <PdfSvg className="fill-blue-500" />
            </span>
            {status === 'active' ?
                <Button callback={deleteById} className="p-2 cursor-pointer transition duration-300 opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0 btn-click">
                    <DeleteSvg className="w-6 h-6 stroke-red-500" />
                </Button>
                : ''}
        </div>
    </div>
}