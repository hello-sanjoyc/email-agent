import { useEffect, useState } from "react";

export default function Video() {
    const [open, setOpen] = useState(false);
    const videoUrl = "https://www.youtube.com/embed/06hNb4SeWYY?autoplay=1";

    useEffect(() => {
        // prevent background scroll when modal open
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <section id="video" className="py-24 px-6">
            <div
                className="relative w-full max-w-7xl mx-auto"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
            >
                {/* Thumbnail Image (rounded & transparent corners) */}
                <div
                    className="video rounded-3xl overflow-hidden bg-transparent"
                    data-aos="fade-up"
                    data-aos-delay="80"
                >
                    <img
                        src="/assets/images/video_bg.png"
                        alt="thumbnail"
                        className="w-full h-auto object-cover bg-transparent rounded-3xl"
                    />
                </div>

                {/* Overlay Button */}
                <button
                    type="button"
                    className="absolute inset-0 flex flex-col items-center justify-center text-white text-center transition"
                    onClick={() => setOpen(true)}
                    data-aos="zoom-in"
                    data-aos-delay="180"
                >
                    {/* Play Button with Waves */}
                    <span className="relative flex items-center justify-center mb-3">
                        <span className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
                            <img
                                src="/assets/images/play_icon.png"
                                alt="play"
                                className="w-6 h-6"
                            />
                        </span>

                        {/* Waves (kept for styling if CSS exists) */}
                        <div className="waves-block">
                            <div className="waves wave-1"></div>
                            <div className="waves wave-2"></div>
                            <div className="waves wave-3"></div>
                        </div>
                    </span>

                    {/* Text */}
                    <span className="block mt-8 md:text-base font-medium">
                        Let's see virtually how it works
                    </span>
                    <span className="text-xs md:opacity-80">Watch video</span>
                </button>

                {/* Modal */}
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="relative w-full max-w-4xl bg-transparent mx-2 max-h-[90vh]">
                            <button
                                aria-label="Close video"
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg z-50"
                                onClick={() => setOpen(false)}
                            >
                                <svg
                                    className="w-5 h-5 text-slate-700"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 6L18 18M6 18L18 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden max-h-[80vh]">
                                <iframe
                                    src={videoUrl}
                                    title="Product video"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
