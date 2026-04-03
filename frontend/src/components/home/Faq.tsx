import { useState } from "react";

export default function Faq() {
    const faqs = [
        {
            q: "What does the AI Email Agent do?",
            a: "The AI Email Agent automatically reads your emails and turns them into actions like creating tasks, scheduling meetings, drafting replies, and forwarding messages—without manual effort.",
        },
        {
            q: "Does the AI send emails on my behalf?",
            a: "The AI creates draft replies for you to review and send. It can automatically forward emails to the right recipients when needed, based on your preferences.",
        },
        {
            q: "Can it create calendar events automatically?",
            a: "Yes. The AI detects meeting-related emails and automatically creates events in your calendar with the correct date, time, and participants.",
        },
        {
            q: "Does it work with Gmail and Outlook?",
            a: "Yes. The app integrates with Google (Gmail, Google Calendar) and Microsoft (Outlook, Calendar), allowing you to manage everything in one place.",
        },
        {
            q: "Is my email data secure?",
            a: "Absolutely. All data is encrypted in transit and at rest. We follow strict security and privacy standards to ensure your information remains protected.",
        },
        {
            q: "Can I control what the AI does?",
            a: "Yes. You can set rules, permissions, and preferences to decide what actions the AI can perform automatically and what requires your approval.",
        },
        {
            q: "Will the AI understand different types of emails?",
            a: "Yes. The AI understands context, including meeting requests, tasks, follow-ups, and general conversations, and takes appropriate actions.",
        },
        {
            q: "Do I need to manually trigger actions?",
            a: "No. The AI works automatically in the background, so you don’t need to manually create tasks, replies, or calendar entries.",
        },
        {
            q: "Is this available as a mobile app?",
            a: "Yes. You can manage your emails, tasks, and calendar actions directly from your mobile device anytime, anywhere.",
        },
        {
            q: "What happens if the AI makes a mistake?",
            a: "You stay in control. You can review actions, undo changes, and adjust settings to improve accuracy over time.",
        },
    ];

    // accordion: only one openIndex at a time; default first open
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    function toggle(i: number) {
        setOpenIndex((prev) => (prev === i ? null : i));
    }

    return (
        <section id="faq" className="py-24 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div
                    className="text-center mb-12"
                    data-aos="fade-up"
                    data-aos-duration="900"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-2">
                        <span className="text-[#644ae9]">FAQ</span>

                        <span className="text-black">
                            {" - "}Frequently Asked Questions
                        </span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Got questions? We’ve got answers. Here are some of our
                        FAQs.
                    </p>
                </div>

                {/* FAQ items */}
                <div className="space-y-6 max-w-6xl mx-auto">
                    {faqs.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-6 bg-white rounded-2xl shadow-sm"
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            data-aos-delay={idx * 40}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-lg font-semibold text-slate-900">
                                    {item.q}
                                </h4>

                                <button
                                    aria-expanded={openIndex === idx}
                                    aria-controls={`faq-panel-${idx}`}
                                    onClick={() => toggle(idx)}
                                    className="ml-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
                                >
                                    {openIndex === idx ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 9.293a1 1 0 011.414 0L10 13.586l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div
                                id={`faq-panel-${idx}`}
                                className={`leading-6 text-slate-600 transition-all overflow-hidden ${openIndex === idx ? "max-h-96" : "max-h-0"}`}
                            >
                                {item.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
