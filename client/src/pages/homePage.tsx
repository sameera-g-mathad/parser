import { Link } from "react-router-dom";
import { Highlight } from "@/reusables";
import { LetsGoSvg, LogoSvg } from "@/svgs";

/**
 * 
 * @returns Homepage of the parser Application.
 */
export const Home = () => {
    return <div className="w-full h-screen flex justify-center items-center">
        {/* First Section */}
        <div className="w-full h-full flex justify-center items-center bg-slate-100">
            <div className="flex flex-col justify-center items-center gap-5 h-full!">
                <LogoSvg className="w-20 h-20 float-along" />
                <span className="text-6xl tracking-widest text-indigo-500 conversation">Parser</span>
                <span className="max-w-[70%] text-center tracking-wide leading-10">
                    <Highlight color="blue">Upload PDFs</Highlight> and let <Highlight color="indigo">Parser</Highlight> transform them into an interactive <Highlight color="orange">knowledge source</Highlight>.
                    Ask <Highlight color="green">contextual questions</Highlight> in plain language about any part of the document.
                    Get  <Highlight color="pink">reliable answers</Highlight> grounded entirely in the document’s content using <Highlight color="defualt">Retrieval-Augmented Generation</Highlight>.
                    <Highlight color="fuchsia">Move efficiently</Highlight> through dense material without manually searching pages.
                    <Highlight color="red">Extract insights</Highlight>, <Highlight color="blue">clarify concepts</Highlight>, and <Highlight color='green'>understand documents</Highlight> in a fraction of the time.

                </span>
                <Link to="/auth/sign-in" className="flex justify-between items-center gap-3 p-3 px-5 bg-indigo-200 text-indigo-600 fill-indigo-600 border-2 border-indigo-600 rounded-xl">
                    <span className="font-semibold tracking-wide text-lg">Explore</span>
                    <LetsGoSvg className="w-7 h-6  btn-click letsgo-animate" />
                </Link>
            </div>
        </div>
    </div>;
};
