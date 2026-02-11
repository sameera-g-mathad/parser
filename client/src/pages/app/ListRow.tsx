import React from "react";
import type { uploadRowInterface } from "@/interface";
import { Button } from "@/reusables";
import { CalenderSvg, DeleteSvg, PdfSvg } from "@/svgs";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param original_name Name of the file to display 
 * @returns A JSX Component with the details of each uplaod. As of
 * now only name is displayed.
 */
export const ListRow: React.FC<uploadRowInterface> = ({ id, original_name, updated_at, status, rowNum, callback, deleting }) => {
    const navigate = useNavigate();

    /**
     * To navigate to a particular upload chat
     * interaface.
     */
    const goTo = () => {
        if (status === 'active') {
            navigate(`/app/uploads/${id}`)
        }
    }

    return <div
        className={`pdf-list  opacity-0 flex justify-between items-center border border-slate-300 bg-white rounded-xl my-2 p-2 px-5 group overflow-hidden cursor-pointer  hover:shadow ${deleting ? 'delete-pdf' : ''}`}
        style={{ animationDelay: `${rowNum! * 0.1}s` }}
        onClick={goTo}
    >
        <div className="flex flex-col flex-5 gap-2">
            <span className="capitalize font-medium ellipses">{original_name}</span>
            <span className="flex items-center gap-1 text-[10px]">
                <span>
                    <span className={`p-0.5 px-2 capitalize border font-semibold rounded-lg ${status === 'active' ? 'text-green-600 border-green-600 bg-green-100' : 'text-slate-700 border-slate-600 bg-slate-100'}`}>{status}</span>
                </span>
            </span>
            <span className="flex gap-2 items-center">
                <CalenderSvg className="w-3 h-3 stroke-slate-300" />
                <span className="text-[10px]">{new Date(updated_at).toDateString()}</span>
            </span>
        </div>
        <div className="flex justify-between items-center flex-1">
            <span className="w-16 h-16 transform transition-transform translate-y-6 rotate-[15deg] group-hover:rotate-0 group-hover:translate-y-0 ">
                <PdfSvg className="fill-blue-500" />
            </span>
            {status === 'active' ?
                <Button
                    callback={(e: React.MouseEvent) => callback(e, id)}
                    className="p-2 cursor-pointer transition duration-300 opacity-100 sm:opacity-0 sm:translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 btn-click"
                >
                    <DeleteSvg className="w-6 h-6 stroke-red-500" />
                </Button>

                : ''}
        </div>
    </div>
}