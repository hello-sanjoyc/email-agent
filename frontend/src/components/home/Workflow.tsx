export default function Workflow() {
    return (
        <section id="features" className="py-24 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div
                    className="text-center mb-12"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <h2 className="text-5xl font-extrabold mb-2">
                        <span className="text-[#644ae9]">Features</span> that
                        makes app different!
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Our features are designed to work invisibly, ensuring
                        you only see what truly matters.
                    </p>
                </div>

                {/* White rounded panel with phone mockup centered and features aside */}
                <div
                    className="relative bg-white rounded-4xl p-6 shadow-md grid grid-cols-1 items-center gap-10 lg:grid-cols-3"
                    data-aos="fade-up"
                    data-aos-duration="1200"
                >
                    {/* Left feature box */}
                    <div className="flex flex-col gap-6">
                        <div
                            className="flex flex-col items-start gap-4 p-6"
                            data-aos="fade-right"
                            data-aos-duration="1500"
                        >
                            <div className="shrink-0">
                                <img
                                    src="/assets/images/smart_parsing.png"
                                    alt="Smart Parsing"
                                    className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900">
                                    Smart Parsing
                                </h4>
                                <p className="mt-2  leading-6 text-slate-600">
                                    Our AI reads and understands the context of
                                    every email, extracting action items and
                                    summarizing long threads into bullet points
                                    instantly.
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex flex-col items-start gap-4 p-6"
                            data-aos="fade-right"
                            data-aos-duration="1500"
                        >
                            <div className="shrink-0">
                                <img
                                    src="/assets/images/calendar_sync.png"
                                    alt="Calendar Sync"
                                    className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900">
                                    Calendar Sync
                                </h4>
                                <p className="mt-2  leading-6 text-slate-600">
                                    Automatically detect meeting requests and
                                    sync them with your calendar. No more
                                    back-and-forth scheduling.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Center image */}
                    <div
                        className="flex justify-center"
                        data-aos="fade-up"
                        data-aos-duration="1500"
                        data-aos-delay="100"
                    >
                        <img
                            src="/assets/images/features.png"
                            alt="Features frame"
                            className="h-auto w-full max-w-sm object-contain md:max-w-md lg:max-w-full"
                        />
                    </div>

                    {/* Right feature box */}
                    <div className="flex flex-col gap-6">
                        <div
                            className="flex flex-col items-start gap-4 p-6"
                            data-aos="fade-left"
                            data-aos-duration="1500"
                        >
                            <div className="shrink-0">
                                <img
                                    src="/assets/images/auto_drafts.png"
                                    alt="Auto-Drafts"
                                    className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900">
                                    Auto-Drafts
                                </h4>
                                <p className="mt-2  leading-6 text-slate-600">
                                    Automatically create drafts for common email
                                    responses, saving you time and effort.
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex flex-col items-start gap-4 p-6"
                            data-aos="fade-left"
                            data-aos-duration="1500"
                        >
                            <div className="shrink-0">
                                <img
                                    src="/assets/images/secure_private.png"
                                    alt="Secure & Private"
                                    className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900">
                                    Secure & Private
                                </h4>
                                <p className="mt-2  leading-6 text-slate-600">
                                    We utilize local-first processing and
                                    end-to-end encryption. Your data is never
                                    used to train global models, and your
                                    privacy is our top priority.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
