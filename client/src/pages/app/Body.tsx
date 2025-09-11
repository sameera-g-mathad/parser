import { FileUpload } from "@/reusables";

/**
 * 
 * @returns A JSX Component that acts as a body of the website for now.
 */
export const Body = () => {
    return <div className="w-full h-full flex flex-col sm:px-32 row-start-2 row-span-full">
        <div className="w-full h-32 flex justify-between items-center sm:px-0 px-2 ">
            <span className="sm:text-xl font-semibold">
                Begin your journey with Parser
            </span>
            <FileUpload />
        </div>
        <div className="h-full bg-amber-500">
            Files
        </div>
    </div>;
};
