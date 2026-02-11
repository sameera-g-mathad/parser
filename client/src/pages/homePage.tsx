import { Link } from "react-router-dom";
import { ArchitectureOverview, StepCard, TechStack, Title } from "./home";
import { ChatSvg, CircuitSvg, GithubSvg, LetsGoSvg, LogoSvg, MailSvg, UploadSvg } from "@/svgs";

/**
 * 
 * @returns Homepage of the parser Application.
 */
export const Home = () => {
    return <div className="w-full h-screen bg-slate-100 overflow-scroll">
        {/* First Section */}
        <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-5 h-full!">
                <LogoSvg className="w-20 h-20 float-along" />
                <span className="text-7xl font-light uppercase text-indigo-500 conversation tracking-tight">Parser</span>
                <span className="max-w-[70%] text-center tracking-wide">
                    Upload PDFs. Ask questions. Get answers powered by RAG and LangChain.
                </span>
                <Link to="/auth/sign-in" className="flex justify-between items-center gap-3 p-3 px-5 text-indigo-600 fill-indigo-600">
                    <span className="font-light uppercase text-sm">Explore</span>
                    <LetsGoSvg className="w-5 h-5 letsgo-animate" />
                </Link>
            </div>
        </div>

        {/* Second Section */}
        <div className="w-full h-full flex justify-center">
            <div className="flex flex-col justify-center items-center h-full! max-w-[90%]">
                <Title subTitle="From upload to conversation in four steps" title="How It Works" />
                <div className="flex flex-wrap justify-center  gap-10">
                    <StepCard icon={<span className="mx-2 rounded-xl p-3 bg-green-200" ><MailSvg className="w-5 h-5 stroke-green-500" /></span>} eyebrow="Step 1" title="Sign Up & Verify" content="Create an account and verify your email. A worker instance handles the verification email via Nodemailer." />
                    <StepCard icon={<span className="mx-2 rounded-xl p-3 bg-blue-200" ><UploadSvg className="w-5 h-5 stroke-blue-500" /></span>} eyebrow="Step 2" title="Upload PDF" content="Upload a PDF file. The API stores it temporarily, then a Redis event triggers the worker to parse, chunk, and embed it using LangChain." />
                    <StepCard icon={<span className="mx-2 rounded-xl p-3 bg-pink-200" ><CircuitSvg className="w-5 h-5 stroke-pink-500" /></span>} eyebrow="Step 3" title="RAG Processing" content="The worker uploads the PDF to S3, creates vector embeddings with LangChain, and stores them in Postgres via pgvector." />
                    <StepCard icon={<span className="mx-2 rounded-xl p-3 bg-rose-200" ><ChatSvg className="w-5 h-5 stroke-rose-500" /></span>} eyebrow="Step 4" title="Chat with Your PDF" content="Ask questions about your document. A two-step process condenses your query, retrieves relevant chunks, and streams a response from ChatGPT." />
                </div>
            </div>
        </div>

        {/* Third Section */}
        <div className="w-full h-full flex justify-center">
            <div className="flex flex-col justify-center items-center h-full! max-w-[90%]">
                <Title subTitle="Dockerized services with clear separation of concerns" title="Architecture" />
                <div className="flex flex-wrap justify-center ">
                    <div className="flex flex-wrap justify-center gap-10">
                        <div>
                            <div className="uppercase text-sm tracking wider mb-5">services</div>
                            <div className="flex flex-col gap-3">
                                <ArchitectureOverview content='Reverse Proxy & Routing' title='Nginx' badge={true} badgeColor="green" />
                                <ArchitectureOverview content='Frontend SPA' title='React + Vite' badge={true} badgeColor="blue" />
                                <ArchitectureOverview content='Auth · Streaming · Data' title='Express API' badge={true} badgeColor="orange" />
                                <ArchitectureOverview content='Emails · Parsing · Embeddings' title='Worker' badge={true} badgeColor="pink" />
                            </div>
                        </div>
                        <div>
                            <div className="uppercase text-sm tracking wider mb-5">services</div>
                            <div className="flex flex-col gap-3">
                                <ArchitectureOverview content='pgvector · Users · Embeddings' title='PostgreSQL' badge={false} />
                                <ArchitectureOverview content='Cache · Pub/Sub · Sessions' title='Redis' badge={false} />
                                <ArchitectureOverview content='PDF File Storage' title='S3 Bucket' badge={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Fourth Section */}
        <div className="w-full h-full flex flex-col items-center">
            <div className="w-full h-[90%]  flex justify-center">
                <div className="flex flex-col justify-center items-center h-full! max-w-[70%]">
                    <Title subTitle="Key technologies that power Parser" title="Tech Stack" />
                    <div className="flex flex-wrap justify-center gap-1">
                        <TechStack title="LangChain" subTitle="RAG pipeline & embeddings" />
                        <TechStack title="ChatGPT" subTitle="LLM streaming responses" />
                        <TechStack title="PGVector" subTitle="Vector similarity search" />
                        <TechStack title="Docker" subTitle="Container orchestration" />
                        <TechStack title="JWT" subTitle="Token-based authentication" />
                        <TechStack title="Nodemailer" subTitle="Email verification" />
                        <TechStack title="Pdfjs-dist" subTitle="PDF rendering in browser" />
                        <TechStack title="Tailwind CSS" subTitle="Utility-first styling" />
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col items-center gap-3">
                <span className="flex gap-3">
                    <span className="text-indigo-600 flex items-center gap-1">
                        <LogoSvg className="w-4 h-4" />
                        <span>PARSER</span>
                    </span>
                    — A learning project exploring LangChain, RAG & the PERN stack
                </span>
                <Link className="flex gap-3" to="https://github.com/sameera-g-mathad/parser">
                    <GithubSvg />
                    <span>Sameer Gururaj Mathad</span>
                </Link>
            </div>
        </div>
    </div>;
};
