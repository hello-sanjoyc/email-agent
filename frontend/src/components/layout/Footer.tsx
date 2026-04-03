import { Link } from "react-router-dom";

export default function Footer() {
    const usefulLinks = [
        { label: "Home", to: "/" },
        { label: "Features", to: "/?section=features" },
        { label: "Plans", to: "/plans" },
        { label: "FAQs", to: "/?section=faq" },
        { label: "Contact us", to: "/?section=contact" },
    ];

    const supportLinks = [
        { label: "Terms & Conditions", to: "/terms-and-conditions" },
        { label: "Privacy Policy", to: "/privacy-policy" },
    ];

    return (
        <footer className="w-full bg-[#6b46ff] text-white font-sans">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start text-center lg:text-left">
                    {/* Brand + contact */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <img
                                src="/assets/images/logo_white.png"
                                alt="Logo"
                                className="h-16 sm:h-24 w-auto"
                            />
                        </div>

                        <div className="text-sm text-white/90">
                            <div>ema@aranax.tech</div>
                            <div className="mt-2">+91 983 079 9651</div>
                        </div>
                    </div>

                    <div className="space-y-4 lg:pl-8">
                        <h4 className="text-xl font-bold">Useful Links</h4>
                        <ul className="space-y-3 text-white/90">
                            {usefulLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div className="space-y-4 lg:pl-8">
                        <h4 className="text-xl font-bold">Help & Support</h4>
                        <ul className="space-y-3 text-white/90">
                            {supportLinks.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA column */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-bold">Let's Try Out</h4>

                        <div className="flex flex-col items-center lg:items-start gap-4">
                            {/* <button className="px-4 py-3 rounded-lg bg-white text-[#6b46ff] font-semibold shadow-sm border border-white/30 flex items-center gap-3">
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="14"
                                        height="14"
                                        rx="2"
                                    />
                                </svg>
                                <span className="text-sm">App Store</span>
                            </button> */}

                            <button className="w-44 sm:w-48 h-auto p-2.5 rounded-lg bg-white shadow-sm border border-white/30 flex items-center gap-3">
                                <img
                                    src="/assets/images/googleplay_blue.png"
                                    alt="Google Play Store"
                                    className="object-contain"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom copyright strip */}
            <div className="w-full bg-[#5a36e0]">
                <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col gap-2 text-center lg:text-left lg:flex-row justify-between items-center text-white/90 text-sm">
                    <div>© Copyright 2026. All rights reserved.</div>
                    <div>
                        Developed by{" "}
                        <a
                            href="https://www.aranaxweb.com"
                            className="underline"
                            target="_blank"
                        >
                            Aranax Technologies Pvt. Ltd.
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
