import { LogoSvg } from "@/svgs";
/**
 * 
 * @returns A commom JSX Component that is used as a fallback
 * when the url is invalid or if the resource is not found.
 */
export const NotFound = () => {
    return <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="flex items-center justify-center gap-4 text-emerald-400!">
            <span className="text-[200px]">4</span>
            <LogoSvg className="float-along w-40 h-40 fill-rose-400!" />
            <span className="text-[200px]">4</span>
        </div>
        <div className="flex justify-center items-center flex-wrap max-w-md conversation text-xl tracking-wide">
            Oops! This page isn’t here. Return to the homepage.
        </div>
    </div>;
};
