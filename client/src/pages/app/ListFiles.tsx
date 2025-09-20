import React, { useEffect, useState } from "react";
import { ListRow } from "./";
import type { uploadRowInterface } from "@/interface";
import { Alert, Button, Input } from "@/reusables";
import { SearchSvg, RefreshSvg } from "@/svgs";
import { useCustomReducer, useErrorHandler } from "@/hooks";

/**
 * 
 * @returns A JSX component that is used to display each upload
 * on the screen
 */
export const ListFiles: React.FC = () => {
    const [data, setData] = useState<uploadRowInterface[]>([])
    const [search, setSearch] = useState<string>('');
    const [count, setCount] = useState<number>(0);
    const { state, setAlertMsg } = useCustomReducer({});
    const { withErrorHandler } = useErrorHandler()
    let reqUrl = '/api/app/get-uploads'


    // get all the uploads from the backend. url is required.
    const getUploads = withErrorHandler(async (url: string = reqUrl) => {
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        )
        const data = await response.json()
        setData(data.uploads)
        setCount(data.count)
    })

    /**
     * To delete a upload by its id. Invoked by ListRow when user deletes.
     */
    const deleteById = withErrorHandler(async (e: React.MouseEvent, id: string) => {
        // this prevents user from visiting the pdf
        e.stopPropagation();

        // this is to add delete animation to the screen
        setData(prev => prev.map(el => {
            if (el.id === id)
                return { ...el, deleting: true } as uploadRowInterface;
            return el
        }))

        // delete the upload from the database.
        const response = await fetch(`/api/app/uploads/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // filter the upload from the current uploads.
        setTimeout(() => {
            setData(prev => prev.filter(el => el.id !== id))
            setCount(prevCount => prevCount - 1)
        }, 300)

        return response

    }, setAlertMsg)


    useEffect(() => {
        // this is to create a query string to search
        // the db for a particular upload.
        let url = reqUrl;
        if (search !== '')
            url += `?search=${encodeURIComponent(search)}`
        getUploads(url)
    }, [search])

    return <div className="flex flex-col ">
        <div className="flex">
            <div className="flex flex-1 border-2 border-slate-300 rounded-xl p-2 my-2 group">
                <SearchSvg className="w-7 h-7 fill-white! stroke-slate-400 group-hover:scale-90" />
                <Input type='text' value={search} callback={(value: string) => setSearch(value)} placeholder="Search your uploads!" className="outline-none flex-1 pl-3 placeholder:text-[15px]" />
            </div>
            <Button callback={() => getUploads()} className="flex border rounded-xl my-2 ml-2 items-center justify-between capitalize p-2 cursor-pointer group btn-click">
                <RefreshSvg className="w-5 h-5 stroke-slate-300 mr-2 group-hover:-rotate-360 transform transition-transform duration-500" />
                refresh
            </Button>
        </div>
        <span className="my-2 text-[14px]">
            {count} uploads with Parser.
        </span>
        {
            data.map((el, i) =>
                <ListRow deleting={el.deleting} callback={deleteById} key={el.id} id={el.id} rowNum={i} original_name={el.original_name} status={el.status} updated_at={el.updated_at} created_at={el.created_at} />
            )
        }
        {
            state.alertMsg['status'] &&
            <Alert className={state.alertMsg['type']} message={state.alertMsg['message']} />
        }
    </div>
};



