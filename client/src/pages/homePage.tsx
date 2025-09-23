import { Link } from "react-router-dom";
import { LetsGoSvg, LogoSvg } from "@/svgs";

/**
 * 
 * @returns Homepage of the parser Application.
 */
export const Home = () => {
    return <div className="w-full h-screen flex justify-center items-center">
        <div className="absolute top-1/2 left-1/2 bg-[linear-gradient(to_top_right,#a5b4fc,#f9a8d4_25%,#fdba74_50%,#5eead4_75%,#f0abfc)] blur-3xl transform -translate-x-1/2 -translate-y-1/2 homepage-animate"></div>
        <div className="flex flex-col gap-5 justify-center items-center z-10">
            <LogoSvg className="w-32 h-32 fill-transparent stroke-white stroke-20 logo-animate" />
            <span className="conversation text-xl tracking-wider uppercase text-slate-600">Parser</span>
            <Link to="/auth/sign-in">
                <LetsGoSvg className="w-6 h-6 fill-white btn-click letsgo-animate" />
            </Link>
        </div>
    </div>;
};
