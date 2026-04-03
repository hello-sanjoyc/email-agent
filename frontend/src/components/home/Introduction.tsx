import { useEffect, useState } from "react";

export default function Introduction() {
    const slides = [
        "/assets/images/slider_01.png",
        "/assets/images/slider_02.png",
        "/assets/images/slider_03.png",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 3500);
        return () => clearInterval(t);
    }, []);

    const scrollToContact = () => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.location.hash = "#contact";
    };

    return (
        <section className="relative mt-2 py-16">
            {/* Background gradient blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none blur-3xl rounded-full" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 px-4">
                {/* Left: Copy */}
                <div
                    className="text-center lg:text-left"
                    data-aos="fade-right"
                    data-aos-duration="1000"
                >
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#644ae9] text-xs font-bold uppercase tracking-wider mb-6"
                        data-aos="fade-down"
                        data-aos-delay="50"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#644ae9] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#644ae9]" />
                        </span>
                        Next-Gen Intelligence
                    </div>

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight"
                        data-aos="fade-up"
                        data-aos-delay="120"
                    >
                        <span className="md:inline text-4xl sm:text-5xl md:text-[96px] uppercase">
                            Stop{" "}
                        </span>
                        Managing Emails. Let{" "}
                        <span className="md:inline text-4xl sm:text-5xl md:text-[96px] text-[#644ae9]">
                            AI
                        </span>{" "}
                        Do It.
                    </h1>

                    <p
                        className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        data-aos="fade-up"
                        data-aos-delay="180"
                    >
                        Turn emails into tasks, meetings, and
                        replies—automatically. No manual work, no missed
                        actions—right from your mobile app, anytime, anywhere.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        data-aos="zoom-in"
                        data-aos-delay="220"
                    >
                        <button
                            onClick={scrollToContact}
                            className="bg-[#644ae9] text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl shadow-purple-500/30 hover:scale-105 transition-transform"
                        >
                            Start Free Trial
                        </button>
                        {/* <button className="bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">
                                play_circle
                            </span>
                            Watch Demo
                        </button> */}
                    </div>
                </div>

                <div
                    className="relative flex justify-center items-center w-full"
                    data-aos="fade-in"
                    data-aos-duration="1500"
                >
                    {/* background purple blob */}
                    <div className="absolute -right-12 w-80 h-80 rounded-full bg-[#6b46ff]/20 pointer-events-none blur-3xl" />

                    {/* left icon */}
                    <div
                        className="absolute -left-6 bottom-12 z-30 hidden md:block"
                        data-aos="fade-right"
                        data-aos-delay="250"
                    >
                        <img
                            src="/assets/images/message_icon.png"
                            alt="message"
                            className="w-32 lg:w-40 xl:w-48 h-auto"
                        />
                    </div>

                    {/* right icon */}
                    <div
                        className="absolute -right-4 top-8 z-10 hidden md:block"
                        data-aos="fade-left"
                        data-aos-delay="300"
                    >
                        <img
                            src="/assets/images/shield_icon.png"
                            alt="shield"
                            className="w-28 lg:w-36 xl:w-44 h-auto opacity-95"
                        />
                    </div>

                    {/* PHONE WRAPPER */}
                    <div className="relative z-20 w-[220px] sm:w-[280px] md:w-[320px] lg:w-[340px] xl:w-[360px] aspect-[360/740]">
                        <div className="absolute inset-[2.4%_6.3%_2.8%_6.3%] z-10 overflow-hidden rounded-[2rem] bg-white">
                            <div
                                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                                style={{
                                    width: `${slides.length * 100}%`,
                                    transform: `translateX(-${(100 / slides.length) * index}%)`,
                                }}
                            >
                                {slides.map((s, i) => (
                                    <div
                                        key={s + i}
                                        className="h-full shrink-0"
                                        style={{
                                            width: `${100 / slides.length}%`,
                                        }}
                                    >
                                        <img
                                            src={s}
                                            alt={`slide ${i + 1}`}
                                            className="block h-full w-full object-cover"
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FRAME */}
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <img
                                src="/assets/images/mobile_frame.png"
                                alt="frame"
                                className="block h-full w-full object-contain"
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* dots */}
                    <div className="absolute -bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`rounded-full transition-all duration-300 ${
                                    i === index
                                        ? "h-3.5 w-3.5 bg-[#6b46ff]"
                                        : "h-2.5 w-2.5 bg-slate-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
