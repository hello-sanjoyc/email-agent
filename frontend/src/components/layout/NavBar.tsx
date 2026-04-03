import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const sectionIds = ["features", "faq", "contact"] as const;
type SectionId = (typeof sectionIds)[number];

const isSectionId = (value: string | null): value is SectionId =>
    !!value && sectionIds.includes(value as SectionId);

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 150);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        // if menu is open, keep navbar scrolled (white)
        if (open) setScrolled(true);
        return () => window.removeEventListener("scroll", onScroll);
    }, [open]);

    const closeMenu = () => setOpen(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/") {
            setActiveSection(null);
            return;
        }

        const params = new URLSearchParams(location.search);
        const sectionFromQuery = params.get("section");
        const sectionFromHash = location.hash.replace("#", "");
        const section = sectionFromQuery || sectionFromHash;

        if (isSectionId(section)) {
            setActiveSection(section);
        }
    }, [location.pathname, location.search, location.hash]);

    useEffect(() => {
        if (location.pathname !== "/") return;

        const updateActiveSection = () => {
            const nav = document.querySelector("nav");
            const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
            const marker = window.scrollY + navHeight + 24;

            let currentSection: SectionId | null = null;

            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.offsetTop <= marker) {
                    currentSection = id;
                }
            }

            setActiveSection(currentSection);
        };

        updateActiveSection();
        window.addEventListener("scroll", updateActiveSection, {
            passive: true,
        });

        return () => window.removeEventListener("scroll", updateActiveSection);
    }, [location.pathname]);

    const doScroll = (id: string) => {
        const el = document.getElementById(id);
        if (!el) {
            window.location.hash = `#${id}`;
            return;
        }

        const nav = document.querySelector("nav");
        const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
        const rect = el.getBoundingClientRect();
        const target = window.scrollY + rect.top - navHeight - 12; // small offset
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    };

    const navigateToSection = (id: SectionId) => {
        closeMenu();
        setActiveSection(id);
        if (location.pathname === "/") {
            doScroll(id);
        } else {
            navigate(`/?section=${id}`);
        }
    };

    // After navigating to the homepage, wait for the target element to appear and scroll to it.
    // Note: cross-page navigation uses ?section= to instruct HomePage to scroll.

    const scrollToContact = () => navigateToSection("contact");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        closeMenu();
        setActiveSection(null);
        navigate("/");
        window.setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 0);
    };

    return (
        <>
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-screen duration-300 backdrop-blur-md ${
                    scrolled ? "bg-white/90 shadow-xs" : "bg-white/0"
                }`}
            >
                <div className="relative mx-auto box-border flex w-full max-w-7xl min-w-0 items-center justify-between gap-2 py-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(3.5rem,calc(env(safe-area-inset-right)+3.5rem))] sm:px-6 sm:pr-6">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={goHome}
                        className="flex min-w-0 items-center"
                    >
                        <img
                            src="/assets/images/logo.png"
                            alt="Email Agent logo"
                            className="h-9 sm:h-12 md:h-16 lg:h-20 w-auto max-w-[140px] sm:max-w-none"
                        />
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        <NavLink
                            to="/"
                            end
                            onClick={goHome}
                            className={({ isActive }) =>
                                `rounded-full px-4 py-1 font-medium transition-all duration-300 ${
                                    isActive && !activeSection
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <button
                            type="button"
                            onClick={() => navigateToSection("features")}
                            className={`rounded-full px-4 py-1 font-medium transition-all duration-300 ${
                                activeSection === "features"
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            Features
                        </button>

                        <NavLink
                            to="/plans"
                            className={({ isActive }) =>
                                `rounded-full px-4 py-1 font-medium transition-all duration-300 ${
                                    isActive
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                }`
                            }
                        >
                            Plans
                        </NavLink>

                        <button
                            type="button"
                            onClick={() => navigateToSection("faq")}
                            className={`rounded-full px-4 py-1 font-medium transition-all duration-300 ${
                                activeSection === "faq"
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            FAQs
                        </button>

                        <button
                            type="button"
                            onClick={() => navigateToSection("contact")}
                            className={`rounded-full px-4 py-1 font-medium transition-all duration-300 ${
                                activeSection === "contact"
                                    ? "bg-violet-100 text-violet-700"
                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            Contact
                        </button>
                    </div>

                    {/* Right side */}
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                        <button
                            onClick={scrollToContact}
                            className="hidden md:inline-flex dark-btn"
                        >
                            Get Started
                        </button>

                        {/* Hamburger */}
                        <button
                            type="button"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                            onClick={() => setOpen(!open)}
                            className="absolute right-[max(0.75rem,env(safe-area-inset-right))] top-1/2 -translate-y-1/2 md:static md:translate-y-0 md:hidden inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50"
                        >
                            {open ? (
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 6L18 18M6 18L18 6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 6h16M4 12h16M4 18h16"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Spacer so content doesn't hide under fixed navbar */}
            <div className="h-16 sm:h-18 md:h-20" />

            {/* Mobile Offcanvas */}
            <div
                className={`fixed inset-0 z-[60] md:hidden ${
                    open ? "pointer-events-auto" : "pointer-events-none"
                }`}
                aria-hidden={!open}
            >
                {/* Backdrop */}
                <div
                    onClick={closeMenu}
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                        open ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Left panel */}
                <aside
                    className={`absolute left-0 top-0 h-full w-[85%] max-w-xs sm:max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                        open ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
                            <NavLink
                                to="/"
                                onClick={closeMenu}
                                className="flex items-center"
                            >
                                <img
                                    src="/assets/images/logo.png"
                                    alt="Email Agent logo"
                                    className="h-12 w-auto"
                                />
                            </NavLink>

                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={closeMenu}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 6L18 18M6 18L18 6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-1 flex-col gap-2 px-4 py-5 sm:px-5">
                            <NavLink
                                to="/"
                                end
                                onClick={goHome}
                                className={({ isActive }) =>
                                    `rounded-lg px-4 py-3 text-base font-medium transition ${
                                        isActive && !activeSection
                                            ? "bg-violet-100 text-violet-700"
                                            : "text-slate-800 hover:bg-slate-100"
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            <button
                                type="button"
                                onClick={() => navigateToSection("features")}
                                className={`rounded-lg px-4 py-3 text-base font-medium transition text-left ${
                                    activeSection === "features"
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-slate-800 hover:bg-slate-100"
                                }`}
                            >
                                Features
                            </button>

                            <NavLink
                                to="/plans"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `rounded-lg px-4 py-3 text-base font-medium transition ${
                                        isActive
                                            ? "bg-violet-100 text-violet-700"
                                            : "text-slate-800 hover:bg-slate-100"
                                    }`
                                }
                            >
                                Plans
                            </NavLink>

                            <button
                                type="button"
                                onClick={() => navigateToSection("faq")}
                                className={`rounded-lg px-4 py-3 text-base font-medium transition text-left ${
                                    activeSection === "faq"
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-slate-800 hover:bg-slate-100"
                                }`}
                            >
                                FAQs
                            </button>

                            <button
                                type="button"
                                onClick={() => navigateToSection("contact")}
                                className={`rounded-lg px-4 py-3 text-base font-medium transition text-left ${
                                    activeSection === "contact"
                                        ? "bg-violet-100 text-violet-700"
                                        : "text-slate-800 hover:bg-slate-100"
                                }`}
                            >
                                Contact
                            </button>
                        </nav>

                        {/* Footer CTA */}
                        <div className="mx-auto px-4 py-4">
                            <button
                                onClick={scrollToContact}
                                className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
            {/* Go to Top button */}
            <button
                onClick={scrollToTop}
                aria-label="Go to top"
                className={`fixed z-50 right-4 bottom-6 flex items-center justify-center h-12 w-12 rounded-full text-white shadow-lg transition-opacity duration-300 ${scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} bg-purple-600 hover:bg-purple-700`}
            >
                <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="currentColor" />
                </svg>
            </button>
        </>
    );
}
