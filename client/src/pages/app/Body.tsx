import { useState } from "react";
import { ListFiles, Banner } from "./";


/**
 * 
 * @returns A JSX Component that acts as a body of the website for now.
 */
export const Body = () => {
    const [refreshCount, setRefreshCount] = useState<number>(0)
    return <div className="w-full h-full flex justify-center row-start-2 row-span-full overflow-y-scroll">
        <div key={refreshCount} className="sm:w-[70%] w-full flex flex-col">
            <Banner />
            <ListFiles callback={() => setRefreshCount(prev => prev + 1)} />
        </div>
    </div>;
};
